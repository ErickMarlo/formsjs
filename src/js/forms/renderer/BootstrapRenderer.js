Package.Register('forms.renderer');

forms.renderer.BootstrapRenderer=forms.renderer.BaseRenderer.extend({
	renderForm : function (frm) {
		return $('<form class="horizontal"></form>');
	}
	,renderColumn : function(fld){
		return $('<div id="'+fld.id+'" class="control-group'+(fld.cols?' col-lg-'+fld.cols:'')+'">');
	}
	,renderRow : function(fld){
		return $('<div id="'+fld.id+'" class="row"></div>');
	}
	,renderBox : function(fld){
		var $tb=$('<div class="toolbar"></div>');
		var $tbul=$('<ul class="nav" _target="toolbar"></ul>');
		for (var i = 0, max = fld.items.length; i < max; i++) {
			var ft=fld.items[i];
			if(ft.target!=='toolbar') continue;
			var $a=$('<a id="'+ft.id+'" href="#">'+(ft.icon?'<i class="icon-'+ft.icon+'"></i>':'')+(ft.label?ft.label:'')+'</a>');
//			if(ft.click) {
//				$a.bind('click',function(){
//					return ft.click.call(fld);
//				});
//			}
			var $ft=$('<li></li>').append($a);
			$tbul.append($ft);
		}
		var $collapselnk=$('<li><a class="accordion-toggle minimize-box" data-toggle="collapse" href="#'+fld.id+'Body">'
						+'<i class="icon-chevron-up"></i>'+'</a></li>');
		var toolbar=$tb.append($tbul.append($collapselnk));
		var $box=$('<div class="box dark" id="'+fld.id+'"></div>');
		return $($box).append(
						$('<header></header>').append('<h5>'+(fld.icon?'<i class="icon-'+fld.icon+'"></i>':'')+''+(fld.label?fld.label:'')+'</h5>',toolbar)
					);
	}
	,renderToolbarButton: function(fld) {
		var $a=$('<a id="'+fld.id+'" href="#">'+(fld.icon?'<i class="icon-'+fld.icon+'"></i>':'')+(fld.label?fld.label:'')+'</a>');
		return $a;
	}
	,renderBoxContent : function(fld){
		var $body=$('<div id="'+fld.id+'Body" class="accordion-body collapse in body"></div>');
		return $body;
	}
	,getValidations: function(fld) {
		if(!fld.validate)return ;
		var s='validate[';
		for(var i=0;i<fld.validate.length;i++) {
			var v=fld.validate[i];
		}
	}
	,renderTextField : function(fld,type){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><input class="form-control" type="'+type+'" id="'+fld.id+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+' value=""></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderCheckbox : function(fld) {
		var $lbl=this._getLabel(fld);
		var chk='<input type="checkbox" id="'+fld.id+'">';
		var $cont=$('<div class="checkbox"></div>');
		return $cont.append($($lbl).prepend(chk));
	}
	,renderCheckboxesField : function(fld){
		var l='<label class="control-label '+(fld.labelcols?'col-lg-'+fld.labelcols:'')+'">'+fld.label+'</label>'
		var $fld=$('<div class="form-group '+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'">'+l+'</div>');
		return $fld;
	}
	,renderCheckboxesCheckbox : function(opt) {
		return	$('<label class="checkbox-inline"><input type="checkbox" name="'+opt._fld.id+'" value="'+opt.value+'">'+opt.text+'</label>');
	}
	,renderTextareaField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><textarea class="form-control" id="'+fld.id+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+'></textarea></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderInfoField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><input class="form-control info" id="'+fld.id+'" disabled="disabled"></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,_getLabel: function(fld){
		if(!fld.label) return '';
		return '<label for="'+fld.id+'" class="control-label '+(fld.labelcols?'col-lg-'+fld.labelcols:'')+'">'+fld.label+(fld.validmap.required===true?' *':'')+'</label>';
	}
	,renderSelectField : function(fld){
		var $fld=this._getLabel(fld)
						+'<div class="'+(fld.controlcols?'col-lg-'+fld.controlcols:'')+'"><select id="'+fld.id+'" class="form-control"></div>';
		var $grp=$('<div class=""></div>').append($fld);
		return $grp;
	}
	,renderButton : function(fld){
		var fld=$('<button type="button" id="'+fld.id+'" class="btn btn-primary btn-lg" data-toggle="modal">'+fld.label+'</button>');
		return fld;
	}
	,renderTabsRoot : function(fld){
		return $('<div id="'+fld.id+'"></div>');
	}
	,renderTabsHead: function(fld){
		return $('<ul class="nav nav-tabs"></ul>');
	}
	,renderTabsBody: function(fld){
		return $('<div class="tab-content"></ul>');
	}
	,renderTabTitle : function(fld,isactive){
		return $('<li'+(isactive?' class="active"':'')+'><a href="#'+fld.id+'" data-toggle="tab">'+fld.label+'</li>');
	}
	,renderTabContent : function(fld,isactive){
		return $('<div class="tab-pane fade '+(isactive?' in active':'')+'" id="'+fld.id+'"></div>')
	}
	,renderTableContainer : function(fld){
		return $('<div class="table-responsive"></div>');
	}
	,renderTable : function(fld){
		return $('<table id="'+fld.id+'" class="table table-striped table-bordered table-hover"></table>');
	}
	,renderTableHead: function(fld){
		return this.renderTableHeadFoot(fld,'thead');
	}
	,renderTableFoot: function(fld){
		return this.renderTableHeadFoot(fld,'tfoot');
	}
	,renderTableHeadFoot : function(fld,type){
		var $thead=$('<'+type+'></'+type+'>');
		var $thtr=$('<tr></tr>');
		for(var i=0;i<fld.columns.length;i++) {
			$thtr.append($('<th></th>').html(fld.columns[i].label));
		}
		$thead.append($thtr);
		return $thead;
	}
	,renderAccordionRoot : function(fld){
		return $('<div id="'+fld.id+'"></div>');
	}
	,renderAccordionItemRoot: function(fld){
		return $('<div class="panel panel-default"></div>');
	}
	,renderAccordionItemHead: function(fld){
		return $('<div class="panel-heading"></div>').append(
						$('<h4 class="panel-title"></h4>')
						.append('<a _target="label" data-toggle="collapse" data-parent="#'+fld.parent.id+'" href="#'+fld.id+'">'+fld.label+'</a>'));
	}
	,renderAccordionItemContent: function(fld){
		return $('<div id="'+fld.id+'" class="panel-collapse collapse'+(fld.index===0?' in':'')+'">');
	}
	,renderAccordionItemBody: function(fld){
		return $('<div class="panel-body"></div>');
	}
	,clearBreadcrumb: function(fld){
		$('ul#'+fld.id+'.breadcrumb').html('');
	}
	,renderBreadcrumbContainer: function(fld){
		return $('<ul id="'+fld.id+'" class="breadcrumb"></ul>');
	}
	,renderBreadcrumbItem: function(fld,isactive,click){
		if(isactive) {
			return $('<li id="'+fld.id+'" class="active">'+fld.label+'</li>');
		} else {
			return $('<li id="'+fld.id+'"></li>').append($('<a href="#">'+fld.label+'</a>').click(function(){
				if(click) {
					return click.call(fld);
				}
			}));
		}
	}
	,renderMessage : function (fld) {
		var $msgdiv=$('<div class="alert alert-'+fld.kind+' alert-dismissable"></div>');
		var $dismissbtn=$('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>');
		$msgdiv.append(fld.title?fld.title:'',$dismissbtn);
		return $msgdiv;
	}
	,renderMessageIcon : function(fld) {
		switch (fld.kind) {
			case 'success':
				var ico='ok-circle';
				break;
			case 'warning':
				var ico='exclamation-sign-sign';
				break;
			case 'info':
				var ico='info-sign';
				break;
			case 'danger':
				var ico='minus-sign';
				break;
			default:
				var ico='comment-alt';
				break;
		}
		return '<i class="fa icon-'+ico+'" style="font-size:2em;"></i>&nbsp;';
	}
	,renderContainerError: function(){
		return $('<span class="container-error label label-danger" data-toggle="tooltip" title="There is errors in fields of this container!"></span>');
	}
	,renderDuallist: function(fld){
		var h='<div class="row">'
                    +'<div class="col-lg-5">'
                        +'<div class="form-group">'
                            +'<div class="input-group">'
                                +'<input id="'+fld.id+'1Filter" type="text" placeholder="Filter" class="form-control">'
                                +'<span class="input-group-btn">'
                                    +'<button id="'+fld.id+'1Clear" class="btn btn-warning" type="button">x</button>'
                                +'</span>'
                            +'</div>'
                        +'</div>'
                        +'<div class="form-group">'
                            +'<select id="'+fld.id+'1View" multiple="multiple" class="form-control" size="16"></select>'
                            +'<hr>'
                            +'<div class="alert alert-block">'
                                +'<span id="'+fld.id+'1Counter" class="countLabel">Showing 16 of 16</span>'
                                +'<select id="'+fld.id+'1Storage" class="form-control" style="display: none;"></select>'
                            +'</div>'
                        +'</div>'
                    +'</div>'

                    +'<div class="col-lg-1">'
                        +'<div class="btn-group btn-group-vertical" style="white-space: normal;">'
                            +'<button id="'+fld.id+'to2" type="button" class="btn btn-primary">'
                                +'<i class="icon-chevron-right"></i>'
                            +'</button>'
                            +'<button id="'+fld.id+'allTo2" type="button" class="btn btn-primary">'
                                +'<i class="icon-forward"></i>'
                            +'</button>'
                            +'<button id="'+fld.id+'allTo1" type="button" class="btn btn-danger">'
                                +'<i class="icon-backward"></i>'
                            +'</button>'
                            +'<button id="'+fld.id+'to1" type="button" class="btn btn-danger">'
                                +'<i class=" icon-chevron-left icon-white"></i>'
                            +'</button>'
                        +'</div>'
                    +'</div>'

                    +'<div class="col-lg-5">'
                        +'<div class="form-group">'
                            +'<div class="input-group">'
                                +'<input id="'+fld.id+'2Filter" type="text" placeholder="Filter" class="form-control">'
                                +'<span class="input-group-btn">'
                                    +'<button id="'+fld.id+'2Clear" class="btn btn-warning" type="button">x</button>'
                                +'</span>'
                            +'</div>'
                        +'</div>'
                        +'<div class="form-group">'
                            +'<select id="'+fld.id+'2View" multiple="multiple" class="form-control" size="16"></select>'
                        +'</div>'
                        +'<hr>'

                        +'<div class="alert alert-block">'
                            +'<span id="'+fld.id+'2Counter" class="countLabel">Showing 0 of 0</span>'
                            +'<select id="'+fld.id+'2Storage" class="form-control" style="display: none;"> </select>'
                        +'</div>'
                    +'</div>'
                +'</div>		';
				return $(h);
	}
	,renderInline: function(fld){
		return 	$('<div class="form-inline"></div>');
	}
	,renderDaterange: function(fld){
		var $fld=this._getLabel(fld)
						+'<div><input class="form-control col-lg-2" type="text" id="'+fld.id+fld.startsuffix+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+' value=""></div>';
		var $fld1='<div><input class="form-control col-lg-2" type="text" id="'+fld.id+fld.endsuffix+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+' value=""></div>';
		var $grp=$('<div class="form-inline"></div>').append($fld,$fld1);
		return $grp;
	}
});
