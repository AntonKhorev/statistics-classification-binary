function generateHtml(options) {
	if (options===undefined) options={};
	if (!('heading' in options)) {
		options.heading=false;
	}
	if (options.heading==true) {
		options.heading='h1';
	}
	var i18n=i18ns.get(options.lang);
	var code=[
		"# "+i18n('load data'),
		"data=read.csv('data.csv')",
		"# "+i18n('build model'),
		"data.model=glm(y~.,data=data,family=binomial)",
	].join("\n");
	return ""+
		(options.heading?"<"+options.heading+">"+i18n.wikipedia('Binary classification')+"</"+options.heading+">":"")+
		"<div data-option='filename'>"+i18n('Input filename')+": <code>data.csv</code></div>"+
		"<div data-option='formula'>"+i18n('Formula')+": <code>y~.</code></div>"+
		"<table>"+
		"<tr><th>"+i18n.wikipedia('Logistic regression')+"</th></tr>"+
		"<tr><td><code><pre>"+code+"</pre></code></td></tr>"+
		"</table>"
	;
}
