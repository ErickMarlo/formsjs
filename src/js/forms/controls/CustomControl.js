Package.Register('forms.controls');

forms.controls.CustomControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		return this._super(field,$('<div></div>'));
	}
	,setval : function(fld,val){
	}
	,getval : function(fld){
	}
});