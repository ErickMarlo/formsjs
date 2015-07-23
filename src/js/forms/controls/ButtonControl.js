Package.Register('forms.controls');

forms.controls.ButtonControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderButton(fld);
		this._super(fld,$($fld).find('a'));
		$('body').on('click','#'+fld.id,function(e){
			if(fld.click) {
				return fld.click(fld);
			}
		});
		return $fld;
	}
	,gather : function(){}
	,scatter : function(){}
});