function generateHtml(options) {
	if (options===undefined) options={};
	if (!('heading' in options)) {
		options.heading=false;
	}
	if (options.heading==true) {
		options.heading='h1';
	}
	function wikipedia(block) {
		var url="https://en.wikipedia.org/wiki/"+block.replace(/ /g,'_');
		return "<a href='"+url+"'>"+block+"</a>";
	}
	var code=[
		"# load data",
		"data=read.csv('data.csv')",
		"# build model",
		"data.model=glm(y~.,data=data,family=binomial)",
	].join("\n");
	return ""+
		(options.heading?"<"+options.heading+">"+wikipedia('Binary classification')+"</"+options.heading+">":"")+
		"<div>Input filename: <code>data.csv</code></div>"+
		"<div>Formula: <code>y~.</code></div>"+
		"<table>"+
		"<tr><th>"+wikipedia('Logistic regression')+"</th></tr>"+
		"<tr><td><code><pre>"+code+"</pre></code></td></tr>"+
		"</table>"
	;
}
