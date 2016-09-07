// JavaScript Document
define(function(require, exports, module){
	var SongOpts = function(obj){
		obj.init = function(){
			obj.element();
			$(document).on('click', '.musicMore', obj.show);
			$(document).on('click', '#songOpts_mask,#songOpts_close', obj.hide);
		};
		obj.element = function(){
			if($('#songOpts').length === 0){
				var ele = '<section class="songOpts" id="songOpts"><div class="songOpts_mask" id="songOpts_mask"></div><div class="songOpts_con"><a href="javascript:;" title="设为彩铃" class="songOpts__order">设为彩铃</a><a href="javascript:;" title="赠送好友" class="songOpts__send">赠送好友</a><a href="javascript:;" title="收藏单曲" class="songOpts__collect">收藏单曲</a><a href="javascript:;" title="取消" class="songOpts__close" id="songOpts_close">取消</a></div></section>';
				$('body').append(ele);
			}
		};
		obj.show = function(){
			$('#songOpts').addClass('show');
		};
		obj.hide = function(callback){
			var ele = $('#songOpts');
			ele.addClass('out');
			setTimeout(function(){
				ele.removeClass('show out');
			}, 300);
		};
		return {
			init: obj.init
		};
	}(SongOpts || {})
	module.exports = SongOpts;
});