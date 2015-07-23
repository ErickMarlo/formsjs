Package.Register('forms.controls');

forms.controls.TableControl=forms.controls.BaseControl.extend({
	renderField : function(fld) {
		var rend=forms.controls.ControlManagerInstance.renderer;
		var $cont=rend.renderTableContainer(fld);
		this._super(fld,$cont);
		var $tt=rend.renderTable(fld);
		var $th=rend.renderTableHead(fld);
		var $tf=rend.renderTableFoot(fld);
		var $table=$tt.append($th,$tf);
		return $cont.append($table);
	}
	,onafterrender : function(fld){
		var opt={
			processing : true
			,serverSide : true
		};
		if(fld.click) {
			opt.rowCallback=function(row,data){
				var $row=$(row);
				$row.bind('click',function(ev){
					$row.addClass('selected');
					fld.click(fld,row._DT_RowIndex,data,$row,ev);
				});
			};
		};
		var cols=[];
		for(var i=0;i<fld.columns.length;i++) {
			cols.push({data:fld.columns[i].id});
		}
		opt.columns=cols;
		opt=$.extend(opt,fld.options);
		$('#'+fld.id).dataTable(opt);
	}
});
