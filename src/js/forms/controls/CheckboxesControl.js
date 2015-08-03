Package.Register('forms.controls');

forms.controls.CheckboxesControl=forms.controls.BaseListControl.extend({
	_renderListField : function(fld) {
		return forms.controls.ControlManagerInstance.renderer.renderCheckboxesField(fld);
	}
	,_findListControl : function($fld) {
		return $fld;
	}
	,_createGroup : function(opt) {
		return $('');
	}
	,_createItem : function(opt) {
		return forms.controls.ControlManagerInstance.renderer.renderCheckboxesCheckbox(opt);
	}
	,setval : function(fld,val){
		for(var i=0;i<val.length;i++) {
			var v=val[i];
			fld.$jq.find(':checkbox[value="'+v+'"]').prop('checked',true);
		}
		fld.form.onchange(fld);
	}
	,getval : function(fld){
		var vv=[];
		fld.$jq.find(':checkbox:checked').each(function(i,o){
			vv.push($(o).val());
		});
		return vv;
	}
});