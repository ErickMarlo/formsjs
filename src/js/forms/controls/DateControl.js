Package.Register('forms.controls');

forms.controls.DateControl=forms.controls.TextControl.extend({
	onafterrender : function(fld){
		this._super(fld);
		var $inp=fld.$jq;
		$inp.datepicker({format:fld.format});
	}
	,setupvaluechange: function(fld){
		this._super(fld);
		var ctx=this;
		fld.$jq.on('changeDate',function(ev){
			ctx.onchange(fld,ev);
		});
	}
	,setval : function(fld,val){
		this._super(fld,val);
		fld.$jq.datepicker('setValue',val);
	}
	,getval : function(fld){
		return this._super(fld);
	}
});