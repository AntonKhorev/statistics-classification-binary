$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var options={};
	if (this.nodeName=='SECTION') {
		options.heading=true;
	}
	containerNode.html(generateHtml(options));
});
