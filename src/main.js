$('.statistics-classification-binary').each(function(){
	var containerNode=$(this);
	var options=getOptions({
		heading: this.nodeName=='SECTION',
		lang: containerNode.closest('[lang]').attr('lang'),
	});
	containerNode.html(generateHtml(options));
	containerNode.find('[data-option]').each(function(){
		// TODO why parsing out stuff when can just regenerate with inputs instead of generateHtml() with static html?
		var div=$(this);
		var optionName=div.attr('data-option');
		var code=div.find('code');
		var optionValue=code.text();
		code.replaceWith(
			$("<input type='text' value='"+optionValue+"' />").on('input',function(){
				options.code[optionName]=this.value;
				containerNode.find('table code pre').text(generateCode(options));
			})
		);
		div.wrapInner("<label>");
	});
});
