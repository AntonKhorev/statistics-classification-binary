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
			get varname(){
				var i=this.filename.lastIndexOf('.');
				if (i>0) {
					return this.filename.substring(0,i);
				} else {
					return this.filename;
				}
			},
		},
		i18n: i18ns.get(htmlOptions.lang),
	};
}

function generateCode(options) {
	return [
		"# "+options.i18n('load data'),
		options.code.varname+"=read.csv('"+options.code.filename+"')",
		"# "+options.i18n('build model'),
		options.code.varname+".model=glm("+options.code.formula+",data="+options.code.varname+",family=binomial)",
	].join("\n");
}

function generateHtml(options) {
	return ""+
		(options.html.heading?"<"+options.html.heading+">"+options.i18n.wikipedia('Binary classification')+"</"+options.html.heading+">":"")+
		"<div data-option='filename'>"+options.i18n('Input filename')+": <code>"+options.code.filename+"</code></div>"+
		"<div data-option='formula'>"+options.i18n('Formula')+": <code>"+options.code.formula+"</code></div>"+
		"<table>"+
		"<tr><th>"+options.i18n.wikipedia('Logistic regression')+"</th></tr>"+
		"<tr><td><code><pre>"+generateCode(options)+"</pre></code></td></tr>"+
		"</table>"
	;
}

function generateStaticHtml(htmlOptions) {
	return generateHtml(getOptions(htmlOptions));
}
