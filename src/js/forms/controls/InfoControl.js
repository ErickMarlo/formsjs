Package.Register('forms.controls');

forms.controls.InfoControl=forms.controls.BaseControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderInfoField(field);
		this._super(field,$($fld).find('.info'));
		return $fld;
	}
	,setval : function(fld,val){
		fld.$jq.html(val);
	}
	,getval : function(fld){
		var val=fld.$jq.html();
		return val;
	}
});