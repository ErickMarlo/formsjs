Package.Register('forms.valid');

forms.valid.PopoverView=Class.extend({
	showsummary: function (ctx,fldid,res,title) {
		var msgs=$('<span></span>');
		for (var i = 0; i < res.length; i++) {
			var r=res[i]
			var msg=$('<a href="#" class="alert-link">'+r.message+'</a>')
			.bind('click',{fld:r.source},function(e) {
				e.data.fld.$jq.focus();
				return false;
			});
			msgs.append('<br/>',msg);
		}
		var fld=ctx.idx.byid[fldid];
		fld.show(msgs,'danger',title);
	}
	,show: function(ctx,res) {
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
//				,animation: true
				,placement: 'top'
				,selector: '#'+fld.id
				,html: true
//				,title: '<a href="#" data-toggle="dismiss" class="close">&times;</a>'
			})
			.on('show.bs.popover',function() {
				var ppo=$(this).data('bs.popover');
				var old=ppo.getCalculatedOffset;
				ppo.getCalculatedOffset=function(a, b, c, d){
					var rr=old(a,b,c,d);
					if(rr.calc) {
						return rr;
					}
//					var txttop=ppo.$element.position().top;
//					var txtlef=ppo.$element.position().left;
					var txtwdt=ppo.$element.width();
					var txthgh=ppo.$element.height();
					var ppohgh=ppo.$tip.height();
					var ppowdt=ppo.$tip.width();
//					ppo.$tip.css('top',txttop-ppohgh);
//					ppo.$tip.css('left',txtlef+txtwdt-ppowdt);
//					console.log('rr.left'+rr.left);
//					console.log('txtwdt'+txtwdt);
//					console.log('ppowdt'+ppowdt);
					rr.left=rr.left+(txtwdt/2)-(ppowdt/2);
					rr.top=rr.top+ppohgh-(txthgh/2);
//					console.log('res rr.left'+rr.left);
//					debugger;
					rr.calc=true;
					return rr;
				};
			})
			.on('shown.bs.popover',function() {
			}).popover('show');
			var p=$jq.parent().parent()
			p.find('.popover').addClass('error-popover');
			p.find('.arrow').addClass('error-popover-arrow');
			p.find('.popover-content').addClass('error-popover-content');
		}
	}
	,clear: function(ctx) {
		ctx.$jq.find('.error-popover').popover('destroy').removeData('bs.popover').remove();
	}
});