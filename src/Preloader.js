Presenter.Preloader = function(game) {};
Presenter.Preloader.prototype = {
	preload: function() {
		this.preloadBg = this.add.sprite((Presenter._WIDTH-297)*0.5, (Presenter._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((Presenter._WIDTH-158)*0.5, (Presenter._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('ball', 'img/ball.png');
		this.load.image('hole', 'img/hole.png');
		this.load.image('element-w', 'img/element-w.png');
		this.load.image('element-h', 'img/element-h.png');
		this.load.image('panel', 'img/panel.png');
		this.load.image('title', 'img/logo.png');
		this.load.image('button-pause', 'img/button-pause.png');
		this.load.image('screen-bg', 'img/screen-bg.png');
		this.load.image('screen-mainmenu', 'img/bg-menu.png');
		this.load.image('screen-howtoplay', 'img/screen-howtoplay.png');
		this.load.image('border-horizontal', 'img/border-horizontal.png');
		this.load.image('border-vertical', 'img/border-vertical.png');

		this.load.spritesheet('button-audio', 'img/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);

		this.load.spritesheet("neimi-archer-bow","img/neimi_archer_bow.png",30,40,13,4,0);
		
		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};