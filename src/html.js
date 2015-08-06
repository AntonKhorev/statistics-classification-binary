function getOptions(htmlOptions) {
	if (htmlOptions===undefined) htmlOptions={};
	if (!('heading' in htmlOptions)) {
		htmlOptions.heading=false;
	}
	if (htmlOptions.heading==true) {
		htmlOptions.heading='h1';
	}
	return {
		html: htmlOptions,
		code: {
			filename: 'data.csv',
			formula: 'y~.',
			threshold: '0.5',
			get data(){
				var i=this.filename.lastIndexOf('.');
				if (i>0) { // . exists and not 0th character
					return this.filename.substring(0,i);
				} else {
					return this.filename;
				}
			},
			get y(){
				var i=this.formula.indexOf('~');
                                if (i>=0) {
					return this.formula.substring(0,i);
				} else {
					// TODO invalid formula, got to warn
					return this.formula;
				}
			}
		},
		i18n: i18ns.get(htmlOptions.lang),
	};
}

function generateCode(options) {
	return [
		"# "+options.i18n('load data'),
		options.code.data+"=read.csv('"+options.code.filename+"')",
		"# "+options.i18n('build model'),
		options.code.data+".model=glm("+options.code.formula+",data="+options.code.data+",family=binomial)",
		"# in-sample probability prediction", // on complete dataset
		options.code.data+".prob=predict("+options.code.data+".model,type='response')",
		"# in-sample class prediction",
		options.code.data+".class=+("+options.code.data+".prob>="+options.code.threshold+")", // TODO html-encode
		"# in-sample accuracy", // TODO wiki link for accuracy
		options.code.data+".acc=mean("+options.code.data+"$"+options.code.y+"=="+options.code.data+".class)",
	].join("\n");
}

function generateHtml(options) {
	return ""+
		(options.html.heading?"<"+options.html.heading+">"+options.i18n.wikipedia('Binary classification')+"</"+options.html.heading+">":"")+
		"<div data-option='filename'>"+options.i18n('Input filename')+": <code>"+options.code.filename+"</code></div>"+
		"<div data-option='formula'>"+options.i18n('Formula')+": <code>"+options.code.formula+"</code></div>"+
		"<div data-option='threshold'>Class probability threshold: <code>"+options.code.threshold+"</code></div>"+
		"<table>"+
		"<tr><th>"+options.i18n.wikipedia('Logistic regression')+"</th></tr>"+
		"<tr><td><code><pre>"+generateCode(options)+"</pre></code></td></tr>"+
		"</table>"
	;
}

function generateStaticHtml(htmlOptions) {
	return generateHtml(getOptions(htmlOptions));
}
