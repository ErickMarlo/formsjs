Package.Register('forms.controls');

forms.controls.DateControl=forms.controls.TextControl.extend({
	renderField : function(fld) {
		var $inp=$($fld).find('input');
		var $fld=this._super(fld,$inp);
		return $fld;
	}
	,onafterrender : function(fld){
		this._super(fld);
		var $inp=fld.$jq;
		$inp.datepicker({format:'dd/mm/yyyy'});
	}
});