Package.Register('forms.renderer');

forms.renderer.BootstrapRenderer=forms.renderer.BaseRenderer.extend({
	renderColumn : function(fld){
		return $('<div id="'+fld.id+'" class="control-group col-lg-'+(fld.cols?fld.cols:'2')+'">');
	}
	,renderRow : function(fld){
		return $('<div id="'+fld.id+'" class="row"></div>');
	}
	,renderBox : function(fld){
		var $tb=$('<div class="toolbar"></div>');
		var $tbul=$('<ul class="nav pull-right"></ul>');
		var $lnk1=$('<li><a class="accordion-toggle minimize-box" data-toggle="collapse" href="#'+fld.id+' div">'
						+(fld.icon?'<i class="icon-chevron-up"></i>':'')+'</a></li>');
		var toolbar=$tb.append($tbul.append($lnk1));
		var $box=$('<div class="box" id="'+fld.id+'"></div>');
		return $($box).append(
						$('<header></header>').append('<h5>'+(fld.icon?'<i class="icon-'+fld.icon+'"></i>':'')+''+(fld.label?fld.label:'')+'</h5>',toolbar));
	}
	,renderTextField : function(fld){
		var $fld=				'<label for="'+fld.id+'" class="control-label">'+fld.label+'</label>'
						+'<div class="controls"><input type="text" id="'+fld.id+'" '+(fld.placeholder?'placeholder="'+fld.placeholder+'"':'')+' class="input-small"></div>';
		var $grp=$('<div class="controls '+(fld.parent && fld.parent.inline?'form-inline':'')+'"></div>').append($fld);
		return $grp;
	}
	,renderSelectField : function(fld){
		var $fld=				'<label for="'+fld.id+'" class="control-label">'+fld.label+'</label>'
						+'<div class="controls"><select id="'+fld.id+'" class="form-control"></div>';
		var $grp=$('<div class="controls '+(fld.parent && fld.parent.inline?'form-inline':'')+'"></div>').append($fld);
		return $grp;
	}
	,renderButton : function(fld){
		var fld=$('<button id="'+fld.id+'" class="btn btn-primary btn-lg" data-toggle="modal">'+fld.label+'</button>');
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
		for(var i=0;i<fld.items.length;i++) {
			$thtr.append($('<th></th>').html(fld.items[i].label));
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
						.append('<a data-toggle="collapse" data-parent="#'+fld.parent.id+'" href="#'+fld.id+'">'+fld.label+'</a>'));
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
					click.call(fld);
				}
			}));
		}
	}
});