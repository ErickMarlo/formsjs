Package.Register('forms.controls');

forms.controls.SelectControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var $fld=forms.controls.ControlManagerInstance.renderer.renderSelectField(fld);
		var select=$($fld).find('select');
		this._super(fld,select);
		var ctx=this;
		fld.load=function(lopt,$jq){
			ctx.load.call(fld,lopt,$jq);
		};
		fld.load(fld.options,select);
		return $fld;
	}
	,load: function(lopt,$jq){
		if(!$jq) $jq=this.$jq;
		if(!lopt)return;
		for(var i=0;i<lopt.length;i++) {
			var opt=lopt[i];
			if(opt.options) {
				var $optgrp=$('<optgroup label="'+opt.text+'"></optgroup>');
				$optgrp.data('data',opt)
				$jq.append($optgrp);
				this.load(opt.options,$optgrp);
			} else {
				var $opt=$('<option value="'+opt.value+'">'+opt.text+'</option>');
				$opt.data('data',opt);
				$jq.append($opt);
			}
		}
	}
	,setupvaluechange: function(fld){
		fld.$jq.on('change',function(ev){
			if(fld.change) fld.change(ev);
			fld.form.change(fld,ev);
		});
	}
});