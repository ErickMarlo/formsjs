Package.Register('forms');

forms.Application=Class.extend({
	navigation: []
	,activeform: null
	,formsdefs: {}
	,forms: {}
	,rootUrl : null
	,selector : null
	,init: function(params){
		$.extend(this,params);
	}
	,addItem: function(formid){
		
	}
	,loadform: function(claz,params,callback){
		var ctx=this;
		var frmpath=(this.rootUrl?this.rootUrl:'')+claz.replace(/\./g, '/');
		$.ajax({
			 url: frmpath
			,type: 'POST'
			,data: params
			,dataType: 'script'
			,success: function(scr){
				ctx.defidx[claz]=eval(scr);
				if(callback) callback.call(ctx);
			}
		});
	}
	,createform: function(deforclaz,params){
		var ctx=this;
		var createFn=function(deforclaz){
			var frm=new (deforclaz)(params);
			ctx.formsdefs[frm.id]=deforclaz;
			frm.render(ctx.selector);
			ctx.forms[frm.id]=frm;
		};
		if(typeof deforclaz=='function') {
			createFn(deforclaz);
			return ;
		} else if(typeof deforclaz=='object') {
			deforclaz=forms.BaseForm.extend(deforclaz);
			createFn(deforclaz);
		} else if(typeof deforclaz=='string') {
			throw 'Not implemented yet';
		}
	}
	,destroyform: function(frmid){
		if(this.activeform==frmid) this.activeform=null;
		for(var i=0;i<this.navigation.length;i++) {
			if(this.navigation[i].id==frmid) {
				this.navigation.splice(i,1);
				break;
			}
		}
		var frm=this.forms[frmid];
		frm.destroy();
		delete this.forms[frmid];
		delete this.formsdefs[frmid];
	}
	,showform: function(frmid){
		this.activeform=frmid;
		if(this.navigation.length>0) {
			this.navigation[this.navigation.length-1].show(false);
		}
		this.navigation.push(this.forms[frmid]);
		this.navigation[this.navigation.length-1].show(true);
		this.updatebreadcrumb();
	}
	,back: function(){
		if(this.navigation.length<=1) {
			return ;
		}
		var curr=this.navigation[this.navigation.length-1];
		var back=this.navigation[this.navigation.length-2];
		curr.show(false);
		back.show(true);
		this.navigation.splice(this.navigation.length-1,1);
		this.activeform=back.id;
		
		this.updatebreadcrumb();
	}
	,updatebreadcrumb: function(){
		var rend=forms.controls.ControlManagerInstance.renderer;
		var breadcrumb={
			id: 'appbreadcrumb'
		};
		rend.clearBreadcrumb(breadcrumb);
		if(!$(this.selector).find('#'+breadcrumb.id).length) {
			$(this.selector).prepend(rend.renderBreadcrumbContainer(breadcrumb));
		}
		var ctx=this;
		for(var i=0;i<this.navigation.length;i++) {
			var frm=this.navigation[i];
			$('#'+breadcrumb.id).append(rend.renderBreadcrumbItem(frm,frm.id==this.activeform,function(){
				if(ctx.activeform!==this.id) {
					ctx.back();
				}
			}));
		}
	}
});