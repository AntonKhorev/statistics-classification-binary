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

var models=[{
	name: 'Baseline method',
	generateCode: function(options){
		var data=options.code.data;
		return [
			"library(ROCR)", // for AUC computation
			"",
			"# "+options.i18n('load data'),
			data+"=read.csv('"+options.code.filename+"')",
			// no model
			"# "+options.i18n('in-sample probability prediction'), // on complete dataset
			data.prob+"=rep_len(mean("+data+"$"+options.code.y+"),nrow("+data+"))",
			// TODO start of copypaste
			"# "+options.i18n('in-sample class prediction'),
			data['class']+"=+("+data.prob+">="+options.code.threshold+")",
			"# "+options.i18n('in-sample accuracy'),
			data.acc+"=mean("+data+"$"+options.code.y+"=="+data['class']+")",
			"# "+options.i18n('in-sample AUC'),
			data.auc+"=performance(",
			"\t"+"prediction("+data.prob+","+data+"$"+options.code.y+"),'auc'",
			")@y.values[[1]]",
		].join("\n");
	},
},{
	name: 'Logistic regression',
	generateCode: function(options){
		var data=options.code.data;
		return [
			"library(ROCR)", // for AUC computation
			"",
			"# "+options.i18n('load data'),
			data+"=read.csv('"+options.code.filename+"')",
			"# "+options.i18n('build model'),
			data.model+"=glm("+options.code.formula+",data="+data+",family=binomial)",
			"# "+options.i18n('in-sample probability prediction'), // on complete dataset
			data.prob+"=predict("+data.model+",type='response')",
			// TODO start of copypaste
			"# "+options.i18n('in-sample class prediction'),
			data['class']+"=+("+data.prob+">="+options.code.threshold+")",
			"# "+options.i18n('in-sample accuracy'),
			data.acc+"=mean("+data+"$"+options.code.y+"=="+data['class']+")",
			"# "+options.i18n('in-sample AUC'),
			data.auc+"=performance(",
			"\t"+"prediction("+data.prob+","+data+"$"+options.code.y+"),'auc'",
			")@y.values[[1]]",
		].join("\n");
	},
},{
	name: 'Regression tree',
	generateCode: function(options){
		var data=options.code.data;
		return [
			"library(rpart)",
			"library(ROCR)", // for AUC computation
			"",
			"# "+options.i18n('load data'), // TODO same
			data+"=read.csv('"+options.code.filename+"')",
			"# "+options.i18n('build model'),
			data.model+"=rpart("+options.code.formula+",data="+data+")",
			"# "+options.i18n('in-sample probability prediction'), // on complete dataset
			data.prob+"=predict("+data.model+")",
			// TODO start of copypaste
			"# "+options.i18n('in-sample class prediction'),
			data['class']+"=+("+data.prob+">="+options.code.threshold+")",
			"# "+options.i18n('in-sample accuracy'),
			data.acc+"=mean("+data+"$"+options.code.y+"=="+data['class']+")",
			"# "+options.i18n('in-sample AUC'),
			data.auc+"=performance(",
			"\t"+"prediction("+data.prob+","+data+"$"+options.code.y+"),'auc'",
			")@y.values[[1]]",
		].join("\n");
	},
}];

function generateCodeTable(options) {
	return ""+
		"<table><tr>"+
			models.map(function(model){
				return "<th>"+options.i18n(model.name)+"</th>";
			}).join("")+
		"</tr><tr>"+
			models.map(function(model){
				return "<td><code><pre>"+model.generateCode(options)+"</pre></code></td>";
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
