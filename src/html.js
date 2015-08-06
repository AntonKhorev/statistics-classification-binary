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
		},
		i18n: i18ns.get(htmlOptions.lang),
	};
}

function generateCode(options) {
	return [
		"# "+options.i18n('load data'),
		"data=read.csv('"+options.code.filename+"')",
		"# "+options.i18n('build model'),
		"data.model=glm("+options.code.formula+",data=data,family=binomial)",
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
