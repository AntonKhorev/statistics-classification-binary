$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var options={
		heading: this.nodeName=='SECTION',
		lang: containerNode.closest('[lang]').attr('lang'),
	};
	containerNode.html(generateHtml(options));
	options={};
	containerNode.find('[data-option]').each(function(){
		// FIXME why parsing out stuff when can just regenerate instead of generateHtml() ?
		var div=$(this);
		var optionName=div.attr('data-option');
		var code=div.find('code');
		var optionValue=code.text();
		options[optionName]=optionValue;
		code.replaceWith("<input type='text' value='"+optionValue+"' />");
		div.wrapInner("<label>");
	});
});
