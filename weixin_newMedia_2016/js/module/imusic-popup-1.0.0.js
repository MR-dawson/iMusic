// JavaScript Document
define(function(require, exports, module){
	require('jquery');
	/** 弹框类
	  * type       弹框鲜果 可选择 fade：淡入淡出效果   slideDown：从上往下效果  默认值：slideDown
	  * titleClass 公共弹框头部样式  默认值：box_h
	**/
	function Popup(type){
		this.type = type || 'slideDown';
		this.init();
	}
	Popup.prototype = {
		currBoxId: null,
		init: function(){
			var _this = this;
			_this.mask = $('<div id="mask" class="mask"></div>').appendTo('body');
			_this.mask.on('click', function(){
				_this.hide(_this.currBoxId);	
			});
		},
		show: function(id, callback){
			this.currBoxId = id;
			var boxObj = $('#'+id);
			$('.box:visible').hide();
			this.type === 'slideDown' ? boxObj.show() : boxObj.fadeIn(200);
			boxObj.css({
				'transform' : 'translateY('+((window.innerHeight - boxObj.innerHeight()) / 2 + document.body.scrollTop)+'px)',
				'-webkit-transform' : 'translateY('+((window.innerHeight - boxObj.innerHeight()) / 2 + document.body.scrollTop)+'px)'
			});
			this.mask.fadeIn(200, callback);
		},
		hide: function(id, callback){
			var boxObj = $('#'+id);
			if(this.type === 'slideDown'){
				boxObj.css({
					'transform' : 'translateY(-100%)',
					'-webkit-transform' : 'translateY(-100%)'
				});
			}
			boxObj.fadeOut(200);
			this.mask.height($('body').height()).fadeOut(200, callback);
		},
		alert: function(content, callback){
			var _this = this;
			if($('#alert').length <= 0){
				var boxObj = '<div class="box" id="alert"><a href="javascript:;" title="关闭弹窗" class="box_close" id="alert_close"></a><div class="box_con"><p id="alert_p">'+content+'</p><div class="box_btn"><a href="javascript:;" title="确定" id="alert_btn">确定</a></div></div></div>';
				$('body').append(boxObj);
			}else{
				$('#alert_p').html(content);
			}
			_this.show('alert');
			$('#alert_close, #alert_btn').off().on('click', function(){
				_this.hide('alert', callback);	
			});
		}	
	}
	module.exports = Popup;
});