Package.Register('forms.controls');

forms.controls.InfoControl=forms.controls.ValueControl.extend({
	renderField : function(field) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderInfoField(field);
		this._super(field,$($fld).find('.info'));
		return $fld;
	}
	,setval : function(fld,val){
		if(fld.formatter) {
			val=fld.formatter.format(val);
		}
		fld.$jq.val(val);
	}
	,getval : function(fld){
	}
});