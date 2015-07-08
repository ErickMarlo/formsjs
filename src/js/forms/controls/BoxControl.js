Package.Register('forms.controls');

forms.controls.BoxControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $boxcontent=this._super(fld,rend.renderBoxContent);
		var $box=rend.renderBox(fld);
		return $box.append($boxcontent);
	}
});