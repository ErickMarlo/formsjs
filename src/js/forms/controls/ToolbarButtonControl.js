Package.Register('forms.controls');

forms.controls.ToolbarButtonControl=forms.controls.ButtonControl.extend({
	getRenderFn : function() {
		return forms.controls.ControlManagerInstance.renderer.renderToolbarButton;
	}
});