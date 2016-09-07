// JavaScript Document
define(function(require, exports, module){
	var Player = function(obj){
		obj.playerACR = new Audio;
		obj.currSong = null;   //当前歌曲
		obj.musicList = [];    //播放列表
		obj.index = 0;         //当前播放列表的索引
		obj.dom = {
			audBtn: $('[data-type=audition]'),
			audAllBtn: $('#auditionAll'),
			player: $('#player'),
			prevBtn: $('#player_prev'),
			playBtn: $('#player_play'),
			nextBtn: $('#player_next'),
			orderBtn: $('#player_order'),
			percent: $('#player_progress'),
			songName: $('#player_song'),
			singerName: $('#player_singer')
		};
		obj.init = function(){
			obj.addEvents();
			obj.addListen();
		};
		obj.addEvents = function(){
			$(document).on('click', '[data-type=audition]', function(){
				if(obj.dom.audBtn.length !== obj.musicList.length){
					obj.dom.audBtn.each(function(index, ele){
						obj.musicList.push($(this));
					});
				}
				obj.index = $('[data-type=audition]').index($(this));
				obj.currSong = $(this);
				obj.post();
				obj.dom.songName.html($(this).find('[data-type=song]').html());
				obj.dom.singerName.html($(this).find('[data-type=singer]').html());
				obj.dom.player.addClass('show');
				$('body').addClass('playerShow');	
			});
			obj.dom.audAllBtn.on('click', function(){
				$('[data-type=audition]').get(0).click();
			});
			obj.dom.nextBtn.on('click', obj.next);
			obj.dom.prevBtn.on('click', obj.prev);
			obj.dom.playBtn.on('click', function(){
				if($(this).hasClass('playing')){
					obj.playerACR.pause();
					obj.pauseing();
				}else{
					if(obj.musicList.length > 0){
						obj.musicList[obj.index].trigger('click');
					}else{
						$('[data-type=audition]').get(0).click();
					}
				}	
			});
		};
		obj.addListen = function(){
			obj.addHandler(obj.playerACR, 'loadstart', obj.loading, false);
			obj.addHandler(obj.playerACR, 'pause', obj.pauseing, false);
			obj.addHandler(obj.playerACR, 'playing', obj.playing);
			obj.addHandler(obj.playerACR, 'ended', obj.complete, false);
			obj.addHandler(obj.playerACR, 'timeupdate', obj.timeupdate, false);	
		};
		obj.post = function(songid){
			if(obj.currSong.hasClass('playing')){
				obj.playerACR.pause();
				obj.pauseing();
			}else{
				if(obj.currSong.data('songItem')){
					obj.play(obj.currSong.data("songItem").audiosrc);
				}else{
					$.ajax({
						url: 'tem/data/music.json',
						type: 'POST',
						data: {songid : obj.currSong.data('songid')},
						beforeSend: function(){
							obj.play('');
							obj.loading();
						},
						dataType: 'json',
						success: function(data){
							obj.play(data.audiosrc);
							obj.currSong.data('songItem', data); //缓存歌曲信息
						},
						error: function(){
							alert('网络异常，请稍后再试！');	
						}	
					});
				}
			}
		};
		obj.loading = function(){			
			obj.dom.playBtn.addClass('loading');
		};
		obj.play = function(src){
			obj.playerACR.src = src;
			obj.playerACR.play();
		},
		obj.playing = function(){
			obj.dom.audBtn.removeClass('playing loading');
			obj.currSong.addClass('playing');
			obj.dom.playBtn.removeClass('loading').addClass('playing');	
		};
		obj.pauseing = function(){
			obj.dom.audBtn.removeClass('playing loading');
			obj.dom.playBtn.removeClass('playing');
			obj.dom.percent.width('0%');
		};
		obj.timeupdate = function(){
			if(!obj.playerACR.paused){
				var per = obj.playerACR.currentTime / obj.playerACR.duration * 100;
				obj.dom.percent.width(per + "%");
			}
		};
		obj.complete = function(){
			if(obj.musicList.length > 1){
				setTimeout(obj.next, 1000);	
			}
		};
		obj.reset = function(){
			obj.playerACR.pause();
			obj.pauseing();
			obj.currSong = null;   
			obj.musicList = [];    
			obj.index = 0;        
		};
		obj.next = function(){
			obj.index = (obj.index + 1) > (obj.musicList.length - 1) ? 0 : obj.index + 1;
			obj.musicList[obj.index].trigger('click');
		};
		obj.prev = function(){
			obj.index = (obj.index - 1) < 0 ? (obj.musicList.length - 1) : obj.index - 1;
			obj.musicList[obj.index].trigger('click');
		};
		obj.addHandler = function(element, type, handler){
			if(element.addEventListener){
				element.addEventListener(type, handler, false);	
			}else if(element.addachEvent){
				element.addachEvent('on' + type, handler);
			}else{
				element['on' + type] = handler;
			}
		};
		obj.removeHandler = function(element, type, handler){
			if(element.removeEventListener){
				element.removeEventListener(type, handler, false);	
			}else if(element.datachEvent){
				element.datachEvent('on' + type, handler);
			}else{
				element['on' + type] = null;
			}
		};
		return {
			init: obj.init	
		};
	}(Player || {});
	module.exports = Player;
});