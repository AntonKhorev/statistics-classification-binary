$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var options={
		heading: this.nodeName=='SECTION',
		lang: containerNode.closest('[lang]').attr('lang'),
	};
	containerNode.html(generateHtml(options));
});
