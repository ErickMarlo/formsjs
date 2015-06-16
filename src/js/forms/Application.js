Package.Register('forms');

forms.Application=Class.extend({
	forms: []
	,activeform: null
	,defidx: {}
	,idx: {}
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
	,createform: function(parent,deforclaz,params){
		if(typeof deforclaz=='object') {
			var frm=new (deforclaz)(params);
			this.defidx[frm.id]=deforclaz;
			frm.render(this.selector);
			this.forms.push(frm);
			this.idx[frm.id]=frm;
			return ;
		} else if(typeof deforclaz=='string') {
			throw 'Not implemented yet';
		}
	}
	,showform: function(formid){
		this.idx[formid].show(true);
		this.activeform=formid;
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
		for(var i=0;i<this.forms.length;i++) {
			var formid=this.forms[i].formid;
			$('#'+breadcrumb.id).append(rend.renderBreadcrumbItem({id:formid+'bci'},formid==this.activeform));
		}
	}
});