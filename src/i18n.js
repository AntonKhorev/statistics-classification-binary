var i18ns={
	data:{},
};
i18ns.get=function(lang) {
	var defaultLang='en';
	lang=lang||defaultLang;
	lang=lang.split('-')[0]; // get primary language subtag
	return function(id){
		var s=i18ns.data[lang][id];
		if (s===undefined) {
			s=i18ns.data[defaultLang][id];
			// TODO set lang/hreflang attrs
			// TODO update lang in wikipedia link
		}
		if (s===undefined) {
			s=id;
		}
		return s.replace(/\[\[(.*?)\]\]/g,function(match,p1){
			var link,text;
			var i=p1.indexOf('|');
			if (i<0) {
				link=p1;
				text=p1;
			} else {
				link=p1.slice(0,i);
				text=p1.slice(i+1);
			}
			return "<a href='https://"+lang+".wikipedia.org/wiki/"+link.replace(/ /g,'_')+"'>"+text+"</a>";
		});
	};
};
