// JavaScript Document
define(function(require, exports, module){
	var Popup = require('popup'),
		Login = require('login'),
		songOpt = require('songOpt'),
		player = require('player');
	popup = new Popup('slideDown');
	new Login({});
	var Main = function(obj){
		obj.init = function(){
			songOpt.init();
			player.init();
		};
		return {
			init: obj.init	
		};	
	}(Main || {});
	module.exports = Main;
});