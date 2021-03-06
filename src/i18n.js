var i18ns={
	data:{},
};
i18ns.get=function(lang) {
	var defaultLang='en';
	lang=lang||defaultLang;
	lang=lang.split('-')[0]; // get primary language subtag
	return function(id){
		var s=i18ns.data[lang][id];
		var sLang=lang;
		if (s===undefined) {
			s=i18ns.data[defaultLang][id];
			sLang=defaultLang;
		}
		if (s===undefined) {
			s=id;
			sLang=null;
		}
		s=s.replace(/\[\[(.*?)\]\]/g,function(match,p1){
			var link,text;
			var i=p1.indexOf('|');
			if (i<0) {
				link=p1;
				text=p1;
			} else {
				link=p1.slice(0,i);
				text=p1.slice(i+1);
			}
			var hreflang="";
			if (sLang && lang!=sLang) {
				hreflang=" hreflang='"+sLang+"'";
			}
			return "<a href='https://"+sLang+".wikipedia.org/wiki/"+link.replace(/ /g,'_')+"'"+hreflang+">"+text+"</a>";
		});
		if (sLang && lang!=sLang) {
			return "<span lang='"+sLang+"'>"+s+"</span>";
		} else {
			return s;
		}
	};
};
