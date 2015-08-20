function htmlEncode(value) {
	// return $('<div/>').text(value).html(); // http://stackoverflow.com/a/1219983 - can't do it w/o jQuery
	return value.toString()
		.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
		.replace(/</g,'&lt;').replace(/>/g,'&gt;')
	; // https://github.com/emn178/js-htmlencode/blob/master/src/htmlencode.js
}

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
			['train','test'].forEach(function(set){
				o[set]={
					toString:function(){
						return dataname+'.'+set;
					},
				};
				o[set].model=dataname+'.model'; // one model for both train/test sets
				['prob','class','acc','auc'].forEach(function(prop){ // different data for train/test sets
					o[set][prop]=dataname+'.'+set+'.'+prop;
				});
			});
			return o;
		},
		get needSplit(){
			return this.splitRatio>0.0 && this.splitRatio<1.0;
		},
		get needProb(){
			return this.threshold>0.0 && this.threshold<1.0;
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
		get rhs(){
			var i=this.formula.indexOf('~');
			if (i>=0) {
				return this.formula.substring(i+1);
			} else {
				// TODO invalid formula, got to warn
				return this.formula;
			}
		},
		toJSON:function(){
			var savedObject={};
			this.userOptionNames.forEach(function(k){
				savedObject[k]=this[k];
			},this);
			return savedObject;
		},
		reset:function(){
			this.filename='data.csv';
			this.postprocess='';
			this.splitSeed='123';
			this.splitRatio='0.7'; // 0.0 or 1.0 for no split
			this.formula='y~.';
			this.threshold='0.5'; // 0.0 or 1.0 for skipping probability predictions
			this.forestSeed='456';
		},
		userOptionNames:['filename','postprocess','formula','splitSeed','splitRatio','threshold','forestSeed'],
	};
	codeOptions.reset();
	for (k in userCodeOptions) {
		codeOptions[k]=userCodeOptions[k];
	}

	return {
		html: htmlOptions,
		code: codeOptions,
		i18n: i18ns.get(htmlOptions.lang),
		encode: htmlEncode,
	};
}

function generateCodeTable(options) {
	var modelClasses=[BaselineModel,LogregModel,CartModel,ForestModel];
	var models=modelClasses.map(function(modelClass){
		return new modelClass(options);
	});
	return ""+
		"<table><tr>"+
			models.map(function(model){
				return "<th>"+options.i18n(model.getNameId())+"</th>";
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
			options.code.userOptionNames.map(function(optionName){
				return "<div class='code-input' data-option='"+optionName+"'><span class='label'>"+options.i18n('options.code.'+optionName)+":</span> <code>"+htmlEncode(options.code[optionName])+"</code></div>";
			}).join("")+
		"</div>"+
		generateCodeTable(options)
	;
}

function generateStaticHtml(htmlOptions,codeOptions) {
	return generateHtml(getOptions(htmlOptions,codeOptions));
}
