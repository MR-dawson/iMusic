seajs.config({
	base: './js/',
	alias: {
		'jquery'     : 'libs/jquery.min.js',
		'fontSize'   : 'module/imusic-fontSize-1.0.1.js',
		'popup'      : 'module/imusic-popup-1.0.0.js',
		'login'      : 'module/imusic-login-1.0.0.js',
    	'player'     : 'module/imusic-player-2.0.0.js',
		'songOpt'    : 'module/song-opts.js'
  	},
	preload: ['fontSize', 'jquery']
});
