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
	var i18n=this.options.i18n;
	return this.listLibraries().map(function(lib){
		return "library("+lib+")";
	}).concat([
		"",
		"# "+i18n('load data'),
		e(data)+"=read.csv('"+e(code.filename)+"')",
	],code.postprocess?[
		"# "+i18n('postprocess data'),
		e(code.postprocess),
	]:[],code.needSplit?[
		"# "+i18n('split data into training/test set'),
		"set.seed("+e(code.splitSeed)+")",
		"split=sample.split("+e(data)+"$"+e(code.y)+",SplitRatio="+e(code.splitRatio)+")",
		e(data.train)+"="+e(data)+"[split,]",
		e(data.test)+"="+e(data)+"[!split,]",
	]:[],this.generateModelProbLines(),[
		"# "+i18n('in-sample class prediction'),
		e(data['class'])+"=+("+e(data.prob)+">="+e(code.threshold)+")",
		"# "+i18n('in-sample accuracy'),
		e(data.acc)+"=mean("+e(data)+"$"+e(code.y)+"=="+e(data['class'])+")",
		"# "+i18n('in-sample AUC'),
		e(data.auc)+"=performance(",
		"\t"+"prediction("+e(data.prob)+","+e(data)+"$"+e(code.y)+"),'auc'",
		")@y.values[[1]]",
	]);
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

var BaselineModel=function(options){
	Model.call(this,options);
};
BaselineModel.prototype=Object.create(Model.prototype);
BaselineModel.prototype.constructor=BaselineModel;
BaselineModel.prototype.name='Baseline method';
BaselineModel.prototype.generateModelProbLines=function(){
	var e=this.options.encode;
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		// no model
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		e(data.prob)+"=rep_len(mean("+e(data)+"$"+e(code.y)+"),nrow("+e(data)+"))",
	];
};

var LogregModel=function(options){
	Model.call(this,options);
};
LogregModel.prototype=Object.create(Model.prototype);
LogregModel.prototype.constructor=LogregModel;
LogregModel.prototype.name='Logistic regression';
LogregModel.prototype.generateModelProbLines=function(){
	var e=this.options.encode;
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		"# "+i18n('build model'),
		e(data.model)+"=glm("+e(code.formula)+",data="+e(data)+",family=binomial)",
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		e(data.prob)+"=predict("+e(data.model)+",type='response')",
	];
};

var CartModel=function(options){
	Model.call(this,options);
};
CartModel.prototype=Object.create(Model.prototype);
CartModel.prototype.constructor=CartModel;
CartModel.prototype.name='Regression tree';
CartModel.prototype.generateModelProbLines=function(){
	var e=this.options.encode;
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		"# "+i18n('build model'),
		e(data.model)+"=rpart("+e(code.formula)+",data="+e(data)+")",
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		e(data.prob)+"=predict("+e(data.model)+")",
	];
};
CartModel.prototype.listLibraries=function(){
	return Model.prototype.listLibraries.call(this).concat([
		'rpart',
	]);
};
