Package.Register('forms.controls');

forms.controls.DuallistControl=forms.controls.BaseListControl.extend({
	_renderListField : function(fld) {
		var h=forms.controls.ControlManagerInstance.renderer.renderDuallist(fld);
		fld.$destination=h.find('#'+fld.id+'2View');
		return h;
	}
	,_findListControl : function($fld,fld) {
		return $($fld).find('#'+fld.id+'1View');
	}
	,_createGroup : function(opt) {
		return $('<optgroup label="'+opt.text+'"></optgroup>');
	}
	,_createItem : function(opt) {
		return $('<option value="'+opt.value+'">'+opt.text+'</option>');
	}
	,onafterrender : function(fld){
		$.configureBoxes({
			box1View : fld.id+'1View'
			,box1Storage: fld.id+'1Storage'
			,box1Filter: fld.id+'1Filter'
			,box1Clear: fld.id+'1Clear'
			,box1Counter: fld.id+'1Counter'
			,box2View: fld.id+'2View'
			,box2Storage: fld.id+'2Storage'
			,box2Filter: fld.id+'2Filter'
			,box2Clear: fld.id+'2Clear'
			,box2Counter: fld.id+'2Counter'
			,to1: fld.id+'to1'
			,allTo1: fld.id+'allTo1'
			,to2: fld.id+'to2'
			,allTo2: fld.id+'allTo2'
			,transferMode: 'move'
			,sortBy: 'text'
			,useFilters: true
			,useCounters: true
			,useSorting: true
			,selectOnSubmit: true
		});
	}
	,setval : function(fld,val){
		for(var i=0;i<val.length;i++) {
			var opt=$('#'+fld.id+'1View option[value="'+val[i]+'"]').remove();
			$('#'+fld.id+'2View').append(opt);
		}
		fld.form.onchange(fld);
	}
	,getval : function(fld){
		var ids=[];
		$('#'+fld.id+'2View option').each(function(i,o){
			ids.push($(o).prop('value'));
		});
		return ids;
	}
});