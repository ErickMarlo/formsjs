Package.Register('forms.controls');

forms.controls.BaseControl=Class.extend({
	controlManager : null
	,indexedseparator : '___'
	,init : function(controlManager){
		this.controlManager=controlManager;
	}
	,preprocess : function(fld,parent){
		var ctx=this;
		if(!fld.type) fld.type='Custom';
		if(!fld.form) fld.form=parent.form;
		this.checkId(fld);
		fld.parent=parent;
		this.checkParentPath(fld);
		if(fld.form.idx.byid[fld.id])throw 'Field with id="'+fld.id+'" already exists in idx.';
		fld.form.idx.byid[fld.id]=fld;
		this._setupvalidation(fld);
		fld.val=function(v) {
			if(typeof v=='undefined') {
				return ctx.getval(fld);
			} else {
				ctx.setval(fld,v);
			}
		};
	}
	,_setupvalidation: function(fld){
		fld.validatefn=function(){
			var res=[];
			if(typeof fld.validate=='function') {
				var fnres=fld.validate();
				if(fnres) {
					res.push({id:fld.id+'Function',source:fld,message:fnres,isvalid:false});
				}
				return res;
			}
			for(var i=0;fld.validate && i<fld.validate.length;i++) {
				var vldr=fld.validate[i];
				for(var vld in vldr) {
					var vldi=forms.controls.ValidatorsInstance.idx[vld];
					if(!vldi) continue;
					var isvalid=vldi.isvalid(fld,vld);
					if(isvalid) {
						var msg=vldi.success(fld,vldr);
					} else {
						var msg=vldi.error(fld,vldr);
					}
					if(msg) {
						res.push({id:fld.id+vld,source:fld,message:msg,isvalid:isvalid});
					}
				}
			}
			return res;
		};
	}
	,validate: function(fld,res) {
		return fld.validatefn(res);
	}
	,destroy: function(fld){
		delete fld.form.idx.byid[fld.id];
	}
	,renderField : function(fld,$fld){
		fld.$jq=$fld;
	}
	,checkId : function(fld){
		if(!fld.id) {
			var cnt=this.controlManager.instanceCounter;
			fld.id='fld'+fld.type+cnt;
			this.controlManager.instanceCounter++;
		}
	}
	,checkParentPath : function(fld){
		if(fld.parent) {
			if(fld.parent.path) {
				fld.parentPath=fld.parent.path;
			}
			if(fld.parent.parentPath) {
				fld.parentPath=fld.parent.parentPath;
			}
		}
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
		var parent=fld.parent;
		while(parent) {
			if(parent.val) break;
			parent=parent.parent;
		}
		var pval=parent.val;
		var val=this.resolveVal(fld,pval);
		this.setval(fld,val);
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
	}
	,getval : function(fld){
		var val=fld.$jq.val();
		return val;
	}
	,onafterrender : function(fld){
		if(fld.onafterrender) {
			fld.onafterrender(fld);
		}
	}
});