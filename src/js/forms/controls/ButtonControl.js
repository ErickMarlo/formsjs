Package.Register('forms.controls');

forms.controls.ButtonControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var $fld=this.getRenderFn()(fld);
		this._super(fld,$fld);
		$('body').on('click','#'+fld.id,function(e){
			if(fld.click) {
				return fld.click(fld);
			}
		});
		return $fld;
	}
	,getRenderFn : function() {
		return forms.controls.ControlManagerInstance.renderer.renderButton;
	}
});