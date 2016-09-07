// JavaScript Document
!(function(){
	//页面自适应
	function setSize(){
		var w = window.innerWidth,
			h = window.innerHeight;
		document.getElementsByTagName('html')[0].style.fontSize = Math.ceil(w * 62.5 / 320) + '%';
	}
	window.addEventListener('load', setSize, false);
	window.addEventListener('resize', setSize, false);
})();