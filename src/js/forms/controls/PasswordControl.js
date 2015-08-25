Package.Register('forms.controls');

forms.controls.PasswordControl=forms.controls.TextControl.extend({
	renderField : function(field) {
		return this._super(field,'password');
	}
});