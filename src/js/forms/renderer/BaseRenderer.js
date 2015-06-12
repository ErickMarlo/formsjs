Package.Register('forms.renderer');

forms.renderer.BaseRenderer=Class.extend({
	init : function(){
		forms.controls.ControlManagerInstance.renderer=this;
	}
	,renderitems : function(form){
		var items=form.items;
		var $root=$('<div class="row">');
		var $obj=$('<div class="col-lg-12">');//$('<div class="row">').append('<div class="col-lg-12">')
		for(var i=0;i<items.length;i++) {
			var fld=items[i];
			$obj.append(this.renderField(fld));
		}
		return $root.append($obj);
	}
	,renderField : function(field){
		var res=forms.controls.ControlManagerInstance.idx[field.type].renderField(field);
		return res;
	}
});