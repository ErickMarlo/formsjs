Package.Register('forms.valid');
Package.Register('forms.valid.temp');

forms.valid.PopoverView=Class.extend({
	show: function(ctx,res) {
		this.clear(ctx);
		var grp={};
		for (var i = 0; i < res.length; i++) {
			var r=res[i]
			var ff=grp[r.source.id];
			if(!ff) {
				ff={};
				ff.fld=r.source;
			}
			var msg=ff.message;
			if(!msg) {
				msg='';
			}
			msg+=r.message+'<br/>';
			ff.message=msg;
			grp[r.source.id]=ff;
		}
		for(var f in grp) {
			var fld=grp[f].fld;
			var msg=grp[f].message;
			var $jq=fld.$jq;
			$jq.removeData('bs.popover');
			var pp=$jq.popover({
				content: msg
				,animation: true
				,placement: 'top'
				,selector: '#'+fld.id
				,html: true
//				,title: '<a href="#" data-toggle="dismiss" class="close">&times;</a>'
			}).popover('show');
			var p=$jq.parent().parent()
			p.find('.popover').addClass('error-popover');
			p.find('.arrow').addClass('error-popover-arrow');
			p.find('.popover-content').addClass('error-popover-content');
			;
		}
	}
	,clear: function(ctx) {
		ctx.$jq.find('.error-popover').popover('destroy').removeData('bs.popover').remove();
	}
});