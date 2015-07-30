Package.Register('forms.controls');

forms.controls.BaseControl=Class.extend({
	controlManager : null
	,indexedseparator : '___'
	,init : function(controlManager){
		this.controlManager=controlManager;
	}
	,preprocess : function(fld,parent){
		if(!fld.form) fld.form=parent.form;
		if(!fld.target) fld.target='body';
		this.checkId(fld);
		fld.parent=parent;
		this.checkParentPath(fld);
		if(fld.form.idx.byid[fld.id])throw 'Field with id="'+fld.id+'" already exists in idx.';
		fld.form.idx.byid[fld.id]=fld;
		this._setuprefnotifications(fld);
		fld.updatelabel=function(label) {
			fld.$jq.find('[_target="label"]').html(label);
		};
	}
	,_setuprefnotifications: function(fld){
		if(fld.ref) {
			var rm=fld.form.refmap;
			if(rm[fld.ref]) {
				var lst=rm[fld.ref];
			} else {
				var lst=[];
				rm[fld.ref]=lst;
			}
			lst.push(fld);
		}
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
					var vldi=forms.valid.ValidatorsInstance.idx[vld];
					if(!vldi) continue;
					var isvalid=vldi.isvalid(fld,vldr);
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
	,validate: function(fld) {
		if(fld.validatefn) return fld.validatefn();
		return [];
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
	,onafterrender : function(fld){
		this._setupvalidation(fld);
		if(fld.onafterrender) {
			fld.onafterrender(fld);
		}
	}
	,onchange : function(fld,ev) {
		if(fld.onchange) fld.onchange(ev);
		var parent=fld.parent;
		while(parent) {
			if(parent.onchange) {
				parent.onchange(fld,ev);
			}
			parent=parent.parent;
		}
		fld.form.onchange(fld,ev);
	}
});