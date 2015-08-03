Package.Register('forms.controls');

forms.controls.BaseListControl=forms.controls.ValueControl.extend({
	renderField : function(fld) {
		var $fld=this._renderListField(fld);
		var select=this._findListControl($fld);
		this._super(fld,select);
		var ctx=this;
		fld._baseListControl=this;
		fld._select=select;
		fld.load=function(lopt){
			ctx.load.call(fld,lopt);
		};
		fld.load(fld.options);
		return $fld;
	}
	,load: function(lopt){
		if(!lopt)return;
		for(var i=0;i<lopt.length;i++) {
			var opt=lopt[i];
			opt._fld=this;
			if(opt.options) {
				var $optgrp=this._baseListControl._createGroup(opt);
				$optgrp.data('data',opt)
				this._select.append($optgrp);
				this.load(opt.options,$optgrp);
			} else {
				var $opt=this._baseListControl._createItem(opt);
				$opt.data('data',opt);
				this._select.append($opt);
			}
		}
	}
	,setupvaluechange: function(fld){
		var ctx=this;
		fld.$jq.on('change',function(ev){
			ctx.onchange(fld,ev);
		});
	}
});