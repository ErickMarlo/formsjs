Package.Register('forms.controls');

forms.controls.ValueControl=forms.controls.BaseControl.extend({
	preprocess : function(fld,parent){
		var ctx=this;
		fld.val=function(v) {
			if(typeof v=='undefined') {
				return ctx.getval(fld);
			} else {
				ctx.setval(fld,v);
			}
		};
		this._super(fld,parent);
	}
	,scatter : function(fld){
		this.onbeforescatter(fld);
		if(fld.path) {
			this.scatterPath(fld);
		} else if(fld.parentPath) {
			this.scatterParentPath(fld);
		} else {
			this.scatterSimple(fld);
		}
		this.onafterscatter(fld);
	}
	,onafterscatter: function(fld){
		if(fld.onafterscatter) {
			fld.onafterscatter();
		}
	}
	,onbeforescatter: function(fld){
		if(fld.onbeforescatter) {
			fld.onbeforescatter();
		}
	}
	,gather : function(fld){
		if(fld.path) {
			this.gatherPath(fld);
		} else if(fld.parentPath) {
			this.gatherParentPath(fld);
		} else {
			this.gatherSimple(fld);
		}
	}
	,gatherSimple : function(fld){
		var val=this.getval(fld);
		fld.form.db.value()[fld.id]=val;
	}
	,scatterSimple : function(fld){
		var val=fld.form.db.value()[fld.id];
		this.setval(fld,val);
	}
	,scatterParentPath : function(fld){
		var path=fld.parentPath+'/'+fld.id.replace(this.indexedseparator,'/');
		var sel=fld.form.db.select(path);
		this.setval(fld,sel.value());
	}
	,resolveVal: function(fld,val){
		var split=fld.id.split(this.indexedseparator);
		if(split.length==1) {
			return val[fld.id];
		} else if(split.length==2) {
			return val[parseInt(split[0])][split[1]];
		} else {
			throw 'Invalid field id: '+fld.id+'. In case of indexed fields it must be in format 0.fieldid.'
		}
	}
	,gatherParentPath : function(fld){
		var val=this.getval(fld);
		if(val==undefined)return;
		var path=fld.parentPath+'/'+fld.id.replace(this.indexedseparator,'/');
		var sel=fld.form.db.select(path);
		if(sel.length==0) throw 'No json path object found for:'+path;
		sel.replace(val);
	}
	,scatterPath : function(fld){
		var val=fld.form.db.select(fld.path).value();
		this.setval(fld,val);
	}
	,gatherPath : function(fld){
		var val=fld.$jq.val();
		var sel=fld.form.db.select(fld.path);
		if(sel.value()) {
			sel.replace(val);
		} else {
			throw 'No path in json in:'+fld.path
		}
	}
	,setval : function(fld,val){
		fld.$jq.val(val);
		fld.form.change(fld);
	}
	,getval : function(fld){
		var val=fld.$jq.val();
		return val;
	}
	,onafterrender : function(fld){
		this._super(fld);
		this.setupvaluechange(fld);
	}
	,setupvaluechange: function(fld){}
});