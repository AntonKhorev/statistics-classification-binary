var i18ns={
	data:{},
};
i18ns.get=function(lang) {
	lang=lang||'en';
	lang=lang.split('-')[0]; // get primary language subtag
	var i18n=function(id) {
		return i18ns.data[lang][id];
	};
	i18n.wikipedia=function(id) {
		var s=i18ns.data[lang][id];
		var wp=i18ns.data[lang][id+'|Wikipedia'];
		if (wp) {
			var url='https://'+lang+'.wikipedia.org/wiki/';
			if (wp===true) {
				url+=s.replace(/ /g,'_');
			} else {
				url+=wp;
			}
			return "<a href='"+url+"'>"+s+"</a>";
		} else {
			return s;
		}
	};
	return i18n;
};
