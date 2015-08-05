var i18ns={
	data:{},
};
i18ns.get=function(lang) {
	lang=lang||'en';
	lang=lang.split('-')[0]; // get primary language subtag
	return {
		wikipedia:function(id) {
			var s=i18ns.data[lang][id];
			var wp=i18ns.data[lang][id+'|Wikipedia'];
			if (wp) {
				var url='https://'+lang+'.wikipedia.org/wiki/'+s.replace(/ /g,'_');
				return "<a href='"+url+"'>"+s+"</a>";
			} else {
				return s;
			}
		},
	};
};
