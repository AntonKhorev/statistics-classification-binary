// converts simple serializable option objects to one with functions
function getOptions(userHtmlOptions,userCodeOptions) {
	if (userHtmlOptions===undefined) userHtmlOptions={};
	if (userCodeOptions===undefined) userCodeOptions={};
	var k;

	// htmlOptions are set by html page authors
	var htmlOptions={};
	for (k in userHtmlOptions) {
		htmlOptions[k]=userHtmlOptions[k];
	}
	if (htmlOptions.heading==true) {
		htmlOptions.heading='h1';
	}

	// codeOptions are set by html page users
	var codeOptions={
		get data(){
			var i=this.filename.lastIndexOf('.');
			var dataname;
			if (i>0) { // . exists and not 0th character
				dataname=this.filename.substring(0,i);
			} else {
				dataname=this.filename;
			}
			var o={
				toString:function(){
					return dataname;
				},
			};
			['model','prob','class','acc','auc'].forEach(function(prop){
				o[prop]=dataname+'.'+prop;
			});

			return o;
		},
		get y(){
			var i=this.formula.indexOf('~');
			if (i>=0) {
				return this.formula.substring(0,i);
			} else {
				// TODO invalid formula, got to warn
				return this.formula;
			}
		},
		toJSON:function(){
			var savedProps=['filename','formula','threshold'];
			var savedObject={};
			savedProps.forEach(function(k){
				savedObject[k]=this[k];
			},this);
			return savedObject;
		},
		reset:function(){
			this.filename='data.csv';
			this.formula='y~.';
			this.threshold='0.5';
		},
	};
	codeOptions.reset();
	for (k in userCodeOptions) {
		codeOptions[k]=userCodeOptions[k];
	}

	return {
		html: htmlOptions,
		code: codeOptions,
		i18n: i18ns.get(htmlOptions.lang),
	};
}

var Model=function(options){
	this.options=options;
};
Model.prototype.generateCode=function(){
	return this.generateLines().join("\n");
};
Model.prototype.generateLines=function(){
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return this.listLibraries().map(function(lib){
		return "library("+lib+")";
	}).concat([
		"",
		"# "+i18n('load data'),
		data+"=read.csv('"+code.filename+"')",
	],this.generateModelProbLines(),[
		"# "+i18n('in-sample class prediction'),
		data['class']+"=+("+data.prob+">="+code.threshold+")",
		"# "+i18n('in-sample accuracy'),
		data.acc+"=mean("+data+"$"+code.y+"=="+data['class']+")",
		"# "+i18n('in-sample AUC'),
		data.auc+"=performance(",
		"\t"+"prediction("+data.prob+","+data+"$"+code.y+"),'auc'",
		")@y.values[[1]]",
	]);
};
Model.prototype.listLibraries=function(){
	return [
		'ROCR', // for AUC computation
	];
}

var BaselineModel=function(options){
	Model.call(this,options);
};
BaselineModel.prototype=Object.create(Model.prototype);
BaselineModel.prototype.constructor=BaselineModel;
BaselineModel.prototype.name='Baseline method';
BaselineModel.prototype.generateModelProbLines=function(){
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		// no model
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		data.prob+"=rep_len(mean("+data+"$"+code.y+"),nrow("+data+"))",
	];
};

var LogregModel=function(options){
	Model.call(this,options);
};
LogregModel.prototype=Object.create(Model.prototype);
LogregModel.prototype.constructor=LogregModel;
LogregModel.prototype.name='Logistic regression';
LogregModel.prototype.generateModelProbLines=function(){
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		"# "+i18n('build model'),
		data.model+"=glm("+code.formula+",data="+data+",family=binomial)",
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		data.prob+"=predict("+data.model+",type='response')",
	];
};

var CartModel=function(options){
	Model.call(this,options);
};
CartModel.prototype=Object.create(Model.prototype);
CartModel.prototype.constructor=CartModel;
CartModel.prototype.name='Regression tree';
CartModel.prototype.generateModelProbLines=function(){
	var code=this.options.code;
	var data=code.data;
	var i18n=this.options.i18n;
	return [
		"# "+i18n('build model'),
		data.model+"=rpart("+code.formula+",data="+data+")",
		"# "+i18n('in-sample probability prediction'), // on complete dataset
		data.prob+"=predict("+data.model+")",
	];
};
CartModel.prototype.listLibraries=function(){
	return Model.prototype.listLibraries.call(this).concat([
		'rpart',
	]);
};

function generateCodeTable(options) {
	var modelClasses=[BaselineModel,LogregModel,CartModel];
	var models=modelClasses.map(function(modelClass){
		return new modelClass(options);
	});
	return ""+
		"<table><tr>"+
			models.map(function(model){
				return "<th>"+options.i18n(model.name)+"</th>";
			}).join("")+
		"</tr><tr>"+
			models.map(function(model){
				return "<td><code><pre>"+model.generateCode()+"</pre></code></td>";
			}).join("")+
		"</tr></table>"
	;
}

function generateHtml(options) {
	return ""+
		(options.html.heading?"<"+options.html.heading+">"+options.i18n('Binary classification')+"</"+options.html.heading+">":"")+
		"<div class='code-options'>"+
			"<div class='code-input' data-option='filename'><span class='label'>"+options.i18n('Input filename')+":</span> <code>"+options.code.filename+"</code></div>"+
			"<div class='code-input' data-option='formula'><span class='label'>"+options.i18n('Formula')+":</span> <code>"+options.code.formula+"</code></div>"+
			"<div class='code-input' data-option='threshold'><span class='label'>"+options.i18n('Classification probability threshold')+":</span> <code>"+options.code.threshold+"</code></div>"+
		"</div>"+
		generateCodeTable(options)
	;
}

function generateStaticHtml(htmlOptions,codeOptions) {
	return generateHtml(getOptions(htmlOptions,codeOptions));
}
