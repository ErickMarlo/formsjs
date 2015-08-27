Package.Register('forms.controls');

forms.controls.DaterangeControl=forms.controls.BaseContainerControl.extend({
	renderField : function(fld) {
		var $cont=this._super(fld,forms.controls.ControlManagerInstance.renderer.renderInline);
		fld.$hidden='<input type="hidden">';
		fld.addItem({
			type: 'Date'
			,id: fld.id+fld.startsuffix
			,controlcols: 2
			,label: fld.label
			,labelcols:1
		});
		fld.addItem({
			type: 'Date'
			,id: fld.id+fld.endsuffix
			,controlcols: 2
		});
		return $cont;
	}
});