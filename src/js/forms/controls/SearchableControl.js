Package.Register('forms.controls');

forms.controls.SearchableControl=forms.controls.SelectControl.extend({
	onafterrender : function(fld){
		this._super(fld);
		fld.$jq.addClass('chzn-select').chosen({width:"100%"});
	}
	,load: function(opt){
		this._super(opt);
		this._select.trigger('chosen:updated');
	}
	,setval: function(fld,val){
		this._super(fld,val);
		fld.$jq.trigger('chosen:updated');
	}
});