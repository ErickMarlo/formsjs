Package.Register('forms.controls');

forms.controls.DateControl=forms.controls.TextControl.extend({
	onafterrender : function(fld){
		this._super(fld);
		var $inp=fld.$jq;
		$inp.datepicker({format:'dd/mm/yyyy'});
	}
	,setupvaluechange: function(fld){
		this._super(fld);
		fld.$jq.on('changeDate',function(ev){
			if(fld.onchange) fld.onchange(ev);
			fld.form.onchange(fld,ev);
		});
	}
});