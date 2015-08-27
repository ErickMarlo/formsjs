Package.Register('forms.utils');

forms.utils.DateFormatter=Class.extend({
	init: function(dateformat){
		this.dateformat=dateformat;
	}
	,getDTOFormat: function(){
		return 'YYYY-MM-DDTHH:mm:ss';
	}
	,toDatepickerFormat: function(){
		return this.dateformat.toLowerCase();
	}
	,format: function(val){
		return moment(val).format(this.dateformat);
	}
});