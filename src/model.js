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

	function concatModelLines(data) {
		lines=lines.concat([this.comment('data.model')]);
		if (code.needProb) {
			lines=lines.concat(this.generateProbModelLines(data));
		} else {
			lines=lines.concat(this.generateClassModelLines(data));
		}
	}
	function concatPostModelLines(data,dataset) {
		var isNewdata=dataset=='data.test';
		if (code.needProb) {
			lines=lines.concat(
				[this.comment(dataset+'.prob')],
				this.generateProbLines(data,isNewdata),
				[this.comment(dataset+'.class')],
				this.generateClassFromProbLines(data)
			);
		} else {
			lines=lines.concat(
				[this.comment(dataset+'.class')],
				this.generateClassFromModelLines(data,isNewdata)
			);
		}
		lines=lines.concat(
			[this.comment(dataset+'.acc')],
			this.generateAccLines(data)
		);
		if (code.needProb) {
			lines=lines.concat(
				[this.comment(dataset+'.auc')],
				this.generateAucLines(data)
			);
		}
	}

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
	if (code.split=='none') {
		concatModelLines.call(this,data);
		concatPostModelLines.call(this,data,'data');
	} else if (code.split=='conditional') {
		lines=lines.concat([
			this.comment('split'),
			e(data.train)+"=subset("+e(data)+","+e(code.splitConditionalCondition)+")",
			e(data.test)+"=subset("+e(data)+",!("+e(code.splitConditionalCondition)+"))",
		]);
		concatModelLines.call(this,data.train);
		concatPostModelLines.call(this,data.train,'data.train');
		concatPostModelLines.call(this,data.test,'data.test');
	} else if (code.split=='random') {
		lines=lines.concat([
			this.comment('split'),
			"set.seed("+e(code.splitRandomSeed)+")",
			"split=sample.split("+e(data)+"$"+e(code.y)+",SplitRatio="+e(code.splitRandomRatio)+")",
			e(data.train)+"="+e(data)+"[split,]",
			e(data.test)+"="+e(data)+"[!split,]",
		]);
		concatModelLines.call(this,data.train);
		concatPostModelLines.call(this,data.train,'data.train');
		concatPostModelLines.call(this,data.test,'data.test');
	}
	return lines;
};
Model.prototype.generateClassFromProbLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data['class'])+"=+("+e(data.prob)+">="+e(code.threshold)+")",
	];
};
Model.prototype.generateAccLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.acc)+"=mean("+e(data)+"$"+e(code.y)+"=="+e(data['class'])+")",
	];
};
Model.prototype.generateAucLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.auc)+"=performance(",
		"\t"+"prediction("+e(data.prob)+","+e(data)+"$"+e(code.y)+"),'auc'",
		")@y.values[[1]]",
	];
};
Model.prototype.listLibraries=function(){
	libs=[];
	if (this.options.code.needProb) {
		libs.push('ROCR'); // for AUC computation
	}
	if (this.options.code.split=='random') {
		libs.push('caTools');
	}
	return libs;
	// TODO require libs from code
};
Model.prototype.comment=function(id){
	return "# "+this.options.i18n('comment.'+id);
};

var BaselineModel=function(options){
	Model.call(this,options);
};
BaselineModel.prototype=Object.create(Model.prototype);
BaselineModel.prototype.constructor=BaselineModel;
BaselineModel.prototype.getNameId=function(){
	return 'model.baseline';
};
BaselineModel.prototype.generateProbModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=mean("+e(data)+"$"+e(code.y)+")",
	];
};
BaselineModel.prototype.generateClassModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=names(sort(-table("+e(data)+"$"+e(code.y)+")))[1]", // http://stackoverflow.com/a/2547551
	];
};
BaselineModel.prototype.generateProbLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=rep_len("+e(data.model)+",nrow("+e(data)+"))",
	];
};
BaselineModel.prototype.generateClassFromModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data['class'])+"=rep_len("+e(data.model)+",nrow("+e(data)+"))",
	];
};

var LogregModel=function(options){
	Model.call(this,options);
};
LogregModel.prototype=Object.create(Model.prototype);
LogregModel.prototype.constructor=LogregModel;
LogregModel.prototype.getNameId=function(){
	return 'model.logreg';
};
LogregModel.prototype.generateProbModelLines=
LogregModel.prototype.generateClassModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=glm("+e(code.formula)+",data="+e(data)+",family=binomial)",
	];
};
LogregModel.prototype.generateProbLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+",type='response')",
	];
};
LogregModel.prototype.generateClassFromModelLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data['class'])+"=+(predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+",type='response')>0.5)",
	];
};

var CartModel=function(options){
	Model.call(this,options);
};
CartModel.prototype=Object.create(Model.prototype);
CartModel.prototype.constructor=CartModel;
CartModel.prototype.getNameId=function(){
	if (this.options.code.needProb) {
		return 'model.cart.prob';
	} else {
		return 'model.cart.class';
	}
};
CartModel.prototype.generateProbModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=rpart("+e(code.formula)+",data="+e(data)+")",
	];
};
CartModel.prototype.generateClassModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.model)+"=rpart("+e(code.formula)+",data="+e(data)+",method='class')",
	];
};
CartModel.prototype.generateProbLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+")",
	];
};
CartModel.prototype.generateClassFromModelLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data['class'])+"=predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+",type='class')",
	];
};
CartModel.prototype.listLibraries=function(){
	return Model.prototype.listLibraries.call(this).concat([
		'rpart',
	]);
};

var ForestModel=function(options){
	Model.call(this,options);
};
ForestModel.prototype=Object.create(Model.prototype);
ForestModel.prototype.constructor=ForestModel;
ForestModel.prototype.getNameId=function(){
	return 'model.forest';
};
ForestModel.prototype.generateProbModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		"set.seed("+e(code.forestSeed)+")",
		e(data.model)+"=randomForest("+e(code.formula)+",data="+e(data)+")",
	];
};
ForestModel.prototype.generateClassModelLines=function(data){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		"set.seed("+e(code.forestSeed)+")",
		e(data.model)+"=randomForest(as.factor("+e(code.y)+")~"+e(code.rhs)+",data="+e(data)+")",
	];
};
ForestModel.prototype.generateProbLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data.prob)+"=predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+")",
	];
};
ForestModel.prototype.generateClassFromModelLines=function(data,isNewdata){
	var e=this.options.encode;
	var code=this.options.code;
	return [
		e(data['class'])+"=predict("+e(data.model)+(isNewdata?",newdata="+e(data):"")+")",
	];
};
ForestModel.prototype.listLibraries=function(){
	return Model.prototype.listLibraries.call(this).concat([
		'randomForest',
	]);
};
