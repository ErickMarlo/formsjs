Package.Register('forms.controls');

forms.controls.BaseControl=Class.extend({
	controlManager : null
	,cnt : 0
	,init : function(controlManager){
		this.controlManager=controlManager;
	}
	,renderField : function(fld,$fld){
		this.checkId(fld);
		fld.$jq=$fld;
		this.checkParentPath(fld);
	}
	,checkId : function(fld){
		if(!fld.id) {
			fld.id='fld'+fld.type+this.cnt;
			this.cnt++;
		}
	}
	,checkParentPath : function(fld){
		if(fld.parent) {
			fld.form=fld.parent.form;
			if(fld.parent.path) {
				fld.parentPath=fld.parent.path;
			}
			if(fld.parent.parentPath) {
				fld.parentPath=fld.parent.parentPath;
			}
		}
	}
	,scatter : function(fld){
		if(fld.path) {
			this.scatterPath(fld);
		} else if(fld.parentPath) {
			this.scatterParentPath(fld);
		} else {
			this.scatterSimple(fld);
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
		var val=this.getVal(fld);
		fld.form.db.value()[fld.id]=val;
	}
	,scatterSimple : function(fld){
		var val=fld.form.db.value()[fld.id];
		this.setVal(fld,val);
	}
	,scatterParentPath : function(fld){
		var parent=fld.parent;
		while(parent) {
			if(parent.val) break;
			parent=parent.parent;
		}
		var pval=parent.val;
		this.setVal(fld,pval[fld.id]);
	}
	,gatherParentPath : function(fld){
		var val=this.getVal(fld);
		var path=fld.parentPath+'/'+fld.id;
		var sel=fld.form.db.select(path);
		if(sel.length==0) throw 'No json path object found for:'+path;
		sel.replace(val);
	}
	,scatterPath : function(fld){
		var val=fld.form.db.select(fld.path).value();
		this.setVal(fld,val);
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
	,setVal : function(fld,val){
		fld.$jq.val(val);
		fld.val=val;
	}
	,getVal : function(fld){
		var val=fld.$jq.val();
		fld.val=val;
		return val;
	}
	,onafterrenderfield : function(fld){
		if(fld.onafterrender) {
			fld.onafterrender(fld);
		}
	}
});