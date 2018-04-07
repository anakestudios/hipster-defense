Presenter.Game = function(game) {};
Presenter.Game.prototype = {
	loadDefaultValues: function(){
		// Iniciar sistema de fìsica
		this.physics.startSystem(Phaser.Physics.ARCADE);

		// Configurar fuente
		this.fontSmall = { font: "11px Arial", fill: "#ffffff" };
		this.fontBig = { font: "24px Arial", fill: "#ffffff" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.fontScore = { font: "15px Arial", fill: "#ffffff" };
		// Estàdo del audio
		this.audioStatus = true;
		// Temporizador
		this.score = 0;
		this.totalTimer = 0;
		// control de niveles
		this.level = 1;
		this.maxLevels = 1;
		this.linePositions = {hx: 64, y: 64};
		//this.selectedRes = null;
		this.selectedResource = null;
		this.resources = {
			'iron': {
				'time': 0,
				'name': 'iron',
				'button': this.btnIron
			},
			'stick': {
				'time': 0,
				'name': 'stick',
				'button': this.btnStick
			},
			'rope': {
				'time': 0,
				'name': 'rope',
				'button': this.btnRope
			}
		};
		this.availableRes = ['iron', 'stick', 'rope'];
	},
	loadButtons: function(){
				// Controladores de botones
		this.pauseButton = this.add.button(Presenter._WIDTH-20, 12, 'button-pause', this.managePause, this);
		this.pauseButton.anchor.set(1,0);
		this.pauseButton.scale.setTo(0.4, 0.4);
		this.pauseButton.input.useHandCursor = true;

/*
		this.audioButton = this.add.button(Presenter._WIDTH-this.pauseButton.width-8*2, 8, 'button-audio', this.manageAudio, this);
		this.audioButton.anchor.set(1,0);
		this.audioButton.input.useHandCursor = true;
		this.audioButton.animations.add('true', [0], 10, true);
		this.audioButton.animations.add('false', [1], 10, true);
		this.audioButton.animations.play(this.audioStatus);
*/	
		this.btnStick = this.add.sprite(200,100, 'btn-stick');
		this.btnStick.inputEnabled = true;
		this.btnStick.available = true;
		//this.btnStick = this.add.button(100,10, 'btn-stick', this.selectRes, this);
		//this.btnStick.time = 0;
		//this.btnStick.frame = 2;
		//this.btnStick.animations.add('available', [0, 1], 1, false);
		//this.btnStick.animations.add('locked', [1], 1, false);
		//this.btnStick.animations.play('available');
		this.btnStick.scale.setTo(1, 0.5);
		//this.btnStick.anch
		this.btnStick.input.useHandCursor = true;
		this.btnStick.events.onInputDown.add((btn) => {
			console.log(btn.animations);
			if(btn.available){
				btn.available = false;
				btn.loadTexture('btn-stick-locked');
			}else{
				btn.loadTexture('btn-stick');
				btn.available = true;
			}
		});
		
		this.btnIron = this.add.button(200,10, 'btn-iron', this.selectRes, this);
		this.btnIron.scale.setTo(1, 0.5);
		this.btnIron.time = 0;
		this.btnIron.input.useHandCursor = true;
		this.btnIron.selected = false;
		/*
		this.btnRope = this.add.button(300,10, 'btn-rope', this.selectRes, this);
		this.btnRope.time = 0;
		this.btnRope.scale.setTo(1, 0.5);
		this.btnRope.input.useHandCursor = true;*/
	},
	//  game.add.image(0, 0, 'undersea'); para los iconos 
	showText: function(){
		// Texto del panel
		this.scoreText = this.game.add.text(12, 8, "Score: "+this.score, this.fontScore);
		this.levelText = this.game.add.text(22, 28, "Level: "+this.level, this.fontSmall);
	},
	getResIndicators: function(x, y){
		var resIndicators = {};
		var indicator;
		for (var i = this.availableRes.length - 1; i >= 0; i--) {
			var indicator;
			x = x-20;
			indicator = this.add.sprite(x-(i*3),y,'icon-'+this.availableRes[i]);
			indicator.key = this.availableRes[i];
			indicator.scale.setTo(0.5,0.5);
			indicator.visible = false;
			resIndicators[this.availableRes[i]] = indicator;
		}
		return resIndicators;

	},

	initHeroes: function(){
		this.heroes = [];
		for(var i = 0; i < 3; i++){
			var y = this.linePositions.y+(70*i);
			var animationSpeed = Math.floor(Math.random() * 10) + 3;
			var hero = this.add.sprite(this.linePositions.hx, y, "h"+(i+1));
			hero.frame = 1;
			hero.animations.add('state', [0,1,2,3,4], animationSpeed, true);
			hero.animations.add('shot', [5,6,7,8,9], 8, true);
			hero.animations.play('state');
			this.physics.enable(hero, Phaser.Physics.ARCADE);
			hero.anchor.set(0);
			hero.body.setSize(1, 1);
			hero.inputEnabled = true;
			hero.res = {'iron': false, 'stick': false, 'rope': false};
			hero.res[this.availableRes[i]] = true;
			hero.indicators = this.getResIndicators(hero.x, hero.y);
			//this.updateHero(hero);
			this.heroes[i] = hero;
			this.heroes[i].events.onInputDown.add((hero) => {
				if(this.selectedResource != null)
					this.takeRes(hero, this.selectedResource);
			});
			this.updateHeroes();
		}
	},
	initEnemies: function(){
		this.enemies = [];
		for(var i = 0; i < 3; i++){
			var y = this.linePositions.y+(70*i);
			var enemy = this.add.sprite(Presenter._WIDTH+100, y, 'enemy');
			enemy.data = {};
			var speed = this.rnd.realInRange(0.1, .6) * this.level;
			enemy.scale.setTo(-1, 1);
			enemy.frame = 1;
			enemy.animations.add('walking', [0,1,2,3,4,5], 8, true);
			enemy.animations.play('walking');
			enemy.data.speed = speed;
			enemy.speed = speed;
			this.enemies[i] = enemy;
		}
		//this.enemies.append()
	},
	takeRes: function(hero, res){
		res = this.selectedResource;
		if(res != null){
			hero.res[res['name']] = true;
			this.lockRes(res);
			this.updateHeroes();
		}
		this.updateResPanel();
	},
	lockRes: function(res){
		if(res['name'] == 'iron'){
			this.btnIron.visible = false;
			//this.btnIron.tint = 0xFF2200;
		}else if(res['name'] == 'rope'){
			this.btnRope.visible = false;
			//this.btnRope.tint = 0xFF2200;
		}else if(res['name'] == 'stick'){
			this.btnStick.visible = false;
			//this.btnStick.tint = 0xFF2200;
		}
		res['time'] =  30;
	},
	unlockRes: function(res){
		this.resources[res]['time'] = 0;
		//this.selectedRes = null;
		if(res == 'iron'){
			//this.btnStick.visible = true;
			//this.btnIron.tint = 0xFFFFFF;
		}else if(res == 'rope'){
			//this.btnRope.visible = true;
			//this.btnRope.tint = 0xFFFFFF;
		}else if(res == 'stick'){
			this.btnStick.visible = true;
			//this.btnStick.tint = 0xFFFFFF;
		}
	},
	
	create: function() {
		this.loadDefaultValues();
		// Agregar fondo y panel
		this.add.sprite(0, 0, 'game-background');
		this.add.sprite(0, 0, 'panel').scale.setTo(0.994, 0.8);
		// Cargar elementos
		this.loadButtons();	
		this.showText();
		this.initHeroes();
		this.initEnemies();
		// Activar entrada del teclado
		this.keys = this.game.input.keyboard.createCursorKeys();
		//Activar event listener window.addEventListener("deviceorientation", this.handleOrientation, true);

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		this.addBorders();
		
		this.bounceSound = this.game.add.audio('audio-bounce');
		//this.updateHeroes();
	},
	addBorders: function(){
		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Presenter._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Presenter._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
	},
	selectRes: function(e){
		if(e == this.btnIron){
			this.selectedResource = this.resources['iron'];
			this.btnIron.loadTexture('btn-stick-locked');
			//this.selectedRes = 'iron';
		}else if(e == this.btnRope){
			this.selectedResource = this.resources['rope'];
			//this.selectedRes = 'rope';
		}else if(e == this.btnStick){
			this.selectedResource = this.resources['stick'];
			//this.selectedRes = 'stick';
		}
		this.updateResPanel();
	},
	updateResPanel: function(){
		for (var i = this.heroes.length - 1; i >= 0; i--) {
			this.heroes[i].input.useHandCursor = true;
		}
		if(this.selectedResource['name'] == 'iron'){
			this.btnIron.tint = 0x53E129;
			this.btnRope.tint = 0xFFFFFF;
			this.btnStick.tint = 0xFFFFFF;
		}else if(this.selectedResource['name'] == 'rope'){
			this.btnRope.tint = 0x53E129;
			this.btnIron.tint = 0xFFFFFF;
			this.btnStick.tint = 0xFFFFFF;
		}else if(this.selectedResource['name'] == 'stick'){
			this.btnStick.tint = 0x53E129;
			this.btnRope.tint = 0xFFFFFF;
			this.btnIron.tint = 0xFFFFFF;
		}else{
			this.btnStick.tint = 0xFFFFFF;
			this.btnRope.tint = 0xFFFFFF;
			this.btnIron.tint = 0xFFFFFF;
			for(var i = this.heroes.length - 1; i >= 0; i--){
				this.heroes[i].input.useHandCursor = false;
			}
		}
	},
	updateCounter: function(){
		this.score+= (this.level);
		this.scoreText.setText("Score: "+this.score);
		for (key in this.resources){
			if(this.resources[key]['time'] > 0){
				this.resources[key]['time'] -=1;
			}else{
				this.unlockRes(key);
			}
		}
	},	
	updateEnemies: function(){
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].x-=this.enemies[i].data.speed * this.level;
		}
	},
	updateHero: function(hero){
		for (var key in hero.res){
			if(hero.res[key]){
				hero.indicators[key].visible = true;
			}else{
				hero.indicators[key].visible = false;
			}
		}
	},
	updateHeroes: function(){
		for (var i = this.heroes.length - 1; i >= 0; i--){
			var hero = this.heroes[i];
			for (var key in hero.res){
				if(hero.res[key]){
					hero.indicators[key].visible = true;
				}else{
					hero.indicators[key].visible = false;
				}
				
			}
		}
	},
	update: function(){
		//this.updateHeroes();
		this.updateEnemies();
		//this.enemy.x--;
	},
	render: function(){
		// this.game.debug.body(this.arher);
		// this.game.debug.body(this.hole);
	},
	wallCollision: function() {
		if(this.audioStatus) {
			this.bounceSound.play();
		}
		// Vibration API
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
	},
	managePause: function() {
		this.game.paused = true;
		var pausedText = this.add.text(Presenter._WIDTH*0.5, 250, "Game paused,\ntap anywhere to continue.", this.fontMessage);
		pausedText.anchor.set(0.5);
		this.input.onDown.add(function(){
			pausedText.destroy();
			this.game.paused = false;
		}, this);
	},
	handleOrientation: function(e){
		try{
			if(!mygame.device.desktop){
				screen.orientation.lock('landscape');		
			}
			
		}catch(err){}
	},
	manageAudio: function() {
		this.audioStatus =! this.audioStatus;
		this.audioButton.animations.play(this.audioStatus);
	}
};