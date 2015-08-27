Package.Register('forms.controls');

forms.controls.DateControl=forms.controls.TextControl.extend({
	onafterrender : function(fld){
		this._super(fld);
		var $inp=fld.$jq;
		$inp.datepicker({format:fld.formatter.toDatepickerFormat()});
	}
	,setupvaluechange: function(fld){
		this._super(fld);
		var ctx=this;
		fld.$jq.on('changeDate',function(ev){
			ctx.onchange(fld,ev);
		});
	}
	,setval : function(fld,val){
		var fval=fld.formatter.format(val);
		this._super(fld,fval);
		fld.$jq.datepicker('setValue',fval);
	}
	,getval : function(fld){
		var ufval=this._super(fld);
		var mm=moment(ufval,fld.formatter.dateformat);
		if(!mm.isValid()) {
			return undefined;
		}
		var val=mm.format(fld.formatter.getDTOFormat());
		return val;
	}
});