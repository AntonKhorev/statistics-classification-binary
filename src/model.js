var Model=function(options){
	this.options=options;
};
Model.prototype.generateCode=function(){
	return this.generateLines().join("\n");
};
Model.prototype.generateLines=function(){
	var e=this.options.encode;
	var code=this.options.code;
	var data=code.data;
	var lines=[];
	lines=lines.concat(this.listLibraries().map(function(lib){
		return "library("+lib+")";
	}),[
		"",
		this.comment('data'),
		e(data)+"=read.csv('"+e(code.filename)+"')",
	]);
	if (code.postprocess) {
		lines=lines.concat([
			this.comment('postprocess'),
			e(code.postprocess),
		]);
	}
	var modelLines;
	if (code.needSplit) {
		lines=lines.concat([
				this.comment('split'),
				"set.seed("+e(code.splitSeed)+")",
				"split=sample.split("+e(data)+"$"+e(code.y)+",SplitRatio="+e(code.splitRatio)+")",
				e(data.train)+"="+e(data)+"[split,]",
				e(data.test)+"="+e(data)+"[!split,]",
		]);
		modelLines=this.generateModelLines(data.train);
		if (modelLines.length) {
			lines=lines.concat([this.comment('data.model')]);
		}
		lines=lines.concat(
			modelLines,
			[this.comment('data.train.prob')],
			this.generateProbLines(data.train),
			this.generateClassLines(data.train,'data.train'),
			[this.comment('data.test.prob')],
			this.generateProbLines(data.test),
			this.generateClassLines(data.test,'data.test')
		);
	} else {
		modelLines=this.generateModelLines(data);
		if (modelLines.length) {
			lines=lines.concat([this.comment('data.model')]);
		}
		lines=lines.concat(
			modelLines,
			[this.comment('data.prob')],
			this.generateProbLines(data),
			this.generateClassLines(data,'data')
		);
	}
	return lines;
};
Model.prototype.generateClassLines=function(data,dataset){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		this.comment(dataset+'.class'),
		e(data['class'])+"=+("+e(data.prob)+">="+e(code.threshold)+")",
		this.comment(dataset+'.acc'),
		e(data.acc)+"=mean("+e(data)+"$"+e(code.y)+"=="+e(data['class'])+")",
		this.comment(dataset+'.auc'),
		e(data.auc)+"=performance(",
		"\t"+"prediction("+e(data.prob)+","+e(data)+"$"+e(code.y)+"),'auc'",
		")@y.values[[1]]",
	];
};
Model.prototype.listLibraries=function(){
	libs=[
		'ROCR', // for AUC computation
	];
	if (this.options.code.needSplit) {
		libs.push('caTools');
	}
	return libs;
	// TODO require libs from code
}
Model.prototype.comment=function(id){
	return "# "+this.options.i18n('comment.'+id);
}

var BaselineModel=function(options){
	Model.call(this,options);
};
BaselineModel.prototype=Object.create(Model.prototype);
BaselineModel.prototype.constructor=BaselineModel;
BaselineModel.prototype.name='Baseline method';
BaselineModel.prototype.generateModelLines=function(data){
	return []; // no model
}
BaselineModel.prototype.generateProbLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=rep_len(mean("+e(data)+"$"+e(code.y)+"),nrow("+e(data)+"))",
	];
};

var LogregModel=function(options){
	Model.call(this,options);
};
LogregModel.prototype=Object.create(Model.prototype);
LogregModel.prototype.constructor=LogregModel;
LogregModel.prototype.name='Logistic regression';
LogregModel.prototype.generateModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=glm("+e(code.formula)+",data="+e(data)+",family=binomial)",
	];
};
LogregModel.prototype.generateProbLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=predict("+e(data.model)+",type='response')",
	];
};

var CartModel=function(options){
	Model.call(this,options);
};
CartModel.prototype=Object.create(Model.prototype);
CartModel.prototype.constructor=CartModel;
CartModel.prototype.name='Regression tree';
CartModel.prototype.generateModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=rpart("+e(code.formula)+",data="+e(data)+")",
	];
};
CartModel.prototype.generateProbLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=predict("+e(data.model)+")",
	];
};
CartModel.prototype.listLibraries=function(){
	return Model.prototype.listLibraries.call(this).concat([
		'rpart',
	]);
};
