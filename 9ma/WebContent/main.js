enchant();

var FPS = 26;
var HEIGHT = 320;
var WIDTH = 240;
var FONT_SIZE = 14;
var LOGO = [ "../images/start.png", "../images/gameover.png" ];
var KUMA = "../images/kuma.png";
//var CONTROLLER = "../images/controller.png";
var BANANA = "../images/banana.png";
var BOMB = "../images/bomb.png";
var ARROW = "../images/arrow.png";
//var MAP_IMG = "../images/map.png";

window.onload = function(){
	var game = new Game(WIDTH, HEIGHT);
	game.fps = FPS;
	game.scale = 1.5;
	game.preload(LOGO);
	game.preload(KUMA);
//	game.preload(CONTROLLER);
	game.preload(BANANA);
	game.preload(BOMB);
	game.preload(ARROW);
//	game.preload(MAP_IMG);
	game.keybind(88, 'x');
	game.keybind(89, 'y');
	game.keybind(90, 'z');
	
	game.onload = function(){
		game.replaceScene(makeTitleScene());
	};
	
	makeTitleScene = function(){
		scene = new Scene();
		
		score = 0;
		var background = new Entity();
		background.width = WIDTH;
		background.height = HEIGHT;
		scene.addChild(background);
		
		var title = new Sprite( 236, 48 );
		title.image = game.assets[LOGO[0]];
		title.frame = 0;
		title.moveTo( WIDTH/2-title.width/2, HEIGHT/2-title.height);
		title.addEventListener( Event.TOUCH_END, function() {
			game.replaceScene(makePlayScene(1.5, 0));
		});
		scene.addEventListener('enterframe', function(){
			if(game.input.z){
				game.replaceScene(makePlayScene(1.5, 0));
			}
			if(game.input.x){
				game.replaceScene(makePlayScene(1, 0));
			}
			if(game.input.y){
				game.replaceScene(makePlayScene(1, 1));
			}
		});
		scene.addChild( title );
		
		var VerLabel = Class.create(Label,{
			initialize: function(x, y, text){
				Label.call(this, x, y);
				this.moveTo(x,y);
				this.text = text;
				this.color = 'black';
				this.font = '14px "Arial"';
				scene.addChild(this);
			}
		});
		
		var label = [];
		label[0] = new VerLabel(76, 190, "Z : Normal ver.");
		label[1] = new VerLabel(78, 210, "X : Chaos ver.");
		label[2] = new VerLabel(73, 230, "Y : Another ver.");
		
		return scene;
	};
	
	makePlayScene = function(v,ptn){
		scene = new Scene();
		var score = 0;
		var start_frame = game.frame;
		
		//背景
		/*
		var map = new Map(32, 32);
		var array = [];
		for (var i = 0; i < 11; i++){
			var temp_array = [];
			for(var j = 0; j < 10; j++){
				switch(i){
				case 10:
					temp_array[j] = 0;
					break;
				default:
					temp_array[j] = -1;
					break;
				}
			}
			array[i] = temp_array;
		}
		
		map.image = game.assets[MAP_IMG];
		map.loadData(array);
		scene.addChild(map);
		*/


		//矢印＋アイコン
		var Set = Class.create(Group,{
			initialize: function(x, y, a, b){
				Group.call(this);
				var icon = new Sprite(32,32);
				if(a == 0){
					icon.image = game.assets[BANANA];
				} else {
					icon.image = game.assets[BOMB];
				}
				this.addChild(icon);
				icon.tl.show()
				.delay(5).hide()
				.delay(5).show()
				.delay(5);
				
				var arrow = new Sprite(16, 32);
				arrow.image = game.assets[ARROW];
				arrow.rotate(90*b);
				if(a != 0){
					arrow.frame = 1;
				}
				var X = 0, Y = 0;
				switch(b){
				case 0:
					X = 32;
					break;
				case 1:
					Y = 32;
					break;
				case 2:
					X = -32;
					break;
				case 3:
					Y = -32;
					break;
				}
				arrow.moveTo(X,Y);
				this.addChild(arrow);
				arrow.tl.show()
				.delay(5).hide()
				.delay(5).show()
				.delay(5);
				
				this.opacity = 0;
				this.moveTo(x,y);
				scene.addChild(this);
			}
		});
		
		//得点アイテム
		var Banana = Class.create(Sprite,{
			initialize: function(x, y){
				Sprite.call(this, 32, 32);
				this.image = game.assets[BANANA];
				this.opacity = 0;
				this.x = x;
				this.y = y;
				scene.addChild(this);
			}
		});
		
		var Banana0 = Class.create(Banana,{
			initialize: function(x, y){
				Sprite.call(this, 32, 32);
				this.image = game.assets[BANANA];
				this.opacity = 0;
				this.x = x;
				this.y = y;
				this.startframe = game.frame;
				scene.addChild(this);
			},
			onenterframe: function(){
				var flg = false;
				if(this.opacity == 1){
					if(this.within(kuma, 32) && !flg){
						this.frame = 1;
						this.tl.moveBy(0, -10, FPS).and().fadeOut(FPS).then(function(){
							scene.removeChild(this);
						});
						score += 100;
						flg = true;
					}
					if(game.frame - this.startframe > FPS + FPS*3/4){
						scene.removeChild(this);
					}
				}
			}
		});
		
		var MoveBanana = Class.create(Banana,{
			initialize: function(x, y, dir){
				Sprite.call(this, 32, 32);
				this.image = game.assets[BANANA];
				this.opacity = 1;
				this.x = x;
				this.y = y;
				scene.addChild(this);
				this.dir = dir;
				this.move = false;
				this.tl.delay(20).then(function(){
					this.move = true;
				});
			},
			onenterframe: function(){
				switch(this.dir){
				case 0:
					if(this.x <= WIDTH && this.move){
						this.x += 25;
					}
					if(this.x > WIDTH){
						scene.removeChild(this);
					}
					break;
				case 1:
					if(this.y <= HEIGHT && this.move){
						this.y += 25;
					}
					if(this.y > HEIGHT){
						scene.removeChild(this);
					}
					break;
				case 2:
					if(this.x >= 0 && this.move){
						this.x -= 25;
					}
					if(this.x < 0){
						scene.removeChild(this);
					}
					break;
				case 3:
					if(this.y >= 0 && this.move){
						this.y -= 25;
					}
					if(this.y < 0){
						scene.removeChild(this);
					}
					break;
				}
				if(this.within(kuma, 24)){
					if(this.frame == 0){score += 100;}
					this.move = false;
					this.frame = 1;
					this.tl.moveBy(0, -10, FPS).and().fadeOut(FPS).then(function(){
						scene.removeChild(this);
					});
				}
			}
		});
		
		//爆弾
		var Bomb = Class.create(Sprite,{
			initialize: function(x, y){
				Sprite.call(this, 32, 32);
				this.image = game.assets[BOMB];
				this.opacity = 0;
				this.x = x;
				this.y = y;
				scene.addChild(this);
			}
		});

		var Bomb0 = Class.create(Bomb,{
			onenterframe: function(){
				if(this.within(kuma, 32) && this.opacity == 1){
					this.frame = 1;
					game.replaceScene(makeResultScene(score));
				}
				if(this.opacity == 1){
					this.frame = 1;
					this.tl.delay(FPS*3/4).then(function(){
						scene.removeChild(this);
					});
				}
			}
		});
		
		var MoveBomb = Class.create(Bomb,{
			initialize: function(x, y, dir){
				Sprite.call(this, 32, 32);
				this.image = game.assets[BOMB];
				this.opacity = 1;
				this.x = x;
				this.y = y;
				scene.addChild(this);
				this.dir = dir;
				this.move = false;
				this.tl.delay(20).then(function(){
					this.move = true;
				});
			},
			onenterframe: function(){
				switch(this.dir){
				case 0:
					if(this.x <= WIDTH && this.move){
						this.x += 25;
					}
					if(this.x > WIDTH){
						scene.removeChild(this);
					}
					break;
				case 1:
					if(this.y <= HEIGHT && this.move){
						this.y += 25;
					}
					if(this.y > HEIGHT){
						scene.removeChild(this);
					}
					break;
				case 2:
					if(this.x >= 0 && this.move){
						this.x -= 25;
					}
					if(this.x < 0){
						scene.removeChild(this);
					}
					break;
				case 3:
					if(this.y >= 0 && this.move){
						this.y -= 25;
					}
					if(this.y < 0){
						scene.removeChild(this);
					}
					break;
				}
				if(this.within(kuma, 24)){
					this.frame = 1;
					game.replaceScene(makeResultScene(score));
				}
			}
		});

		//トラップ
		var traps = [];
		//トラップ0
		var Trap0 = function(){
			var icons = [];
			var r = [];
			var judge = [false, false, false];
			do{
				for (var i = 0; i < 9; i++){
					r[i] = rand(1,-1);
					if(r[i] == -1) { judge[0] = true;}
					if(r[i] == 0){ judge[1] = true; }
					if(r[i] == 1) { judge[2] = true;}
				}
			}while(!judge[0] || !judge[1] || !judge[2]);
			var flg = false;
			for(var i =  0; i < 9; i++){
				if(r[i] == 0 && !flg){
					icons[i] = new Banana0(WIDTH/2 + 32 * (i%3 - 1.5),
						HEIGHT/2 + 32 * (Math.floor(i/3) - 1.5));
					icons[i].tl.hide().fadeIn(FPS*3/4);
					flg = !flg;
				} else if(r[i] == 1){
					icons[i] = new Bomb0(WIDTH/2 + 32 * (i%3 - 1.5),
						HEIGHT/2 + 32 * (Math.floor(i/3) - 1.5));
					icons[i].tl.hide().fadeIn(FPS*3/4);
				}
			}
		};
		//トラップ1~4
		var Trap = function(j){
			var icons = [];
			var marks = [];
			var r = rand(2,0);
			var coor = [];
			for(var i =  0; i < 3; i++){
				switch(j){
				case 1:
					coor[0] = -32;
					coor[1] = HEIGHT/2 + 32 * (i - 1.5);
					coor[2] = WIDTH/2 - 32 * 3;
					coor[3] = HEIGHT/2 + 32 * (i - 1.5);
				break;
				case 2:
					coor[0] = WIDTH/2 + 32 * (i - 1.5);
					coor[1] = -32;
					coor[2] = WIDTH/2 + 32 * (i - 1.5);
					coor[3] = HEIGHT/2 - 32 * 3;
				break;
				case 3:
					coor[0] = WIDTH + 32;
					coor[1] = HEIGHT/2 + 32 * (i - 1.5);
					coor[2] = WIDTH/2 + 32 * 2.5;
					coor[3] = HEIGHT/2 + 32 * (i - 1.5);
				break;
				case 4:
					coor[0] = WIDTH/2 + 32 * (i - 1.5);
					coor[1] = HEIGHT+32;
					coor[2] = WIDTH/2 + 32 * (i - 1.5);
					coor[3] = HEIGHT/2 + 32 * 2.5;
				break;
				}
				if(i == r){
					icons[i] = new MoveBanana(coor[0], coor[1], j-1);
					marks[i] = new Set(coor[2], coor[3], 0, j-1);
					marks[i].tl.show()
					.delay(5).hide()
					.delay(4).show()
					.delay(5).then(function(){
						scene.removeChild(this);
					});
				} else {
					icons[i] = new MoveBomb(coor[0], coor[1], j-1);
					marks[i] = new Set(coor[2], coor[3], 1, j-1);
					marks[i].tl.show()
					.delay(5).hide()
					.delay(4).show()
					.delay(5).then(function(){
						scene.removeChild(this);
					});
				}
			}
		};
		
		traps = [Trap0, Trap];

		//トラップ発動関数
		function Execute(){ 
			var r = rand(12);
			switch(r){
			case 0:
				traps[0]();
				break;
			case 1:
			case 2:
			case 3:
			case 4:
				traps[1](r);
				break;
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
				traps[1](r%4+1);
				traps[1]((r+1)%4+1);
				break;
			}
		}
		function AnotherExecute(){ 
			var r = rand(8);
			switch(r){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
				traps[0]();
				break;
			case 5:
			case 6:
			case 7:
			case 8:
				traps[1](r%4+1);
				traps[1]((r+1)%4+1);
				break;
			}
		}
		
		//ｸﾏｰ
		var kuma = new Sprite(32, 32);
		kuma.image = game.assets[KUMA];
		kuma.frame = 0;
		kuma.moveTo(WIDTH/2 - kuma.width/2, HEIGHT/2 - kuma.height/2);
		scene.addChild(kuma);
		
		//ｸﾏｰ操作関数
		var kuma_x = kuma.x;
		var kuma_y = kuma.y;
		var pos =[false,false,false,false];
		game.keybind(37, 'left');
		game.keybind(38, 'up');
		game.keybind(39, 'right');
		game.keybind(40, 'down');
		for(var i = 0; i < 4; i++){
			var buttondown = ["leftbuttondown", "upbuttondown", "rightbuttondown", "downbuttondown"];
			(function(){
				var li = i;
				if(!pos[li]){
					scene.addEventListener(buttondown[i], function(){
						pos[li] = true;
					});
				}
			})();
		}
		for(var i = 0; i < 4; i++){
			var buttonup = ["leftbuttonup", "upbuttonup", "rightbuttonup", "downbuttonup"];
			(function(){
				var li = i;
				scene.addEventListener(buttonup[i], function(){
					pos[li] = false;
				});
				
			})();
		}
		kuma.on("touchmove", function(e){
			var x = e.x;
			var y = e.y;
			if(x < WIDTH/2 - kuma.width/2) {pos[0] = true;}
			else {pos[0] = false;}
			if(y < HEIGHT/2 - kuma.height/2) {pos[1] = true;}
			else {pos[1] = false;}
			if(x > WIDTH/2 + kuma.width/2) {pos[2] = true;}
			else {pos[2] = false;}
			if(y > HEIGHT/2 + kuma.height/2) {pos[3] = true;}
			else {pos[3] = false;}
		});
		kuma.on("touchend", function(){
			for(var i = 0; i < 4; i++){
				pos[i] = false;
			}
		});
		function ContPos(l,u,r,d){
			if(u){
				kuma.y = kuma_y - kuma.height;
			}
			if(d){
				kuma.y = kuma_y + kuma.height;
			}
			if(!u && !d){
				kuma.y = kuma_y;
			}
			if(l){
				kuma.x = kuma_x - kuma.height;
			}
			if(r){
				kuma.x = kuma_x + kuma.height;
			}
			if(!l && !r){
				kuma.x = kuma_x;
			}
		}
		
		//スコア
		var label = new Label();
		label.y = 4;
		label.x = 200;
		label.font = FONT_SIZE + 'px "Arial"';
		label.text = score;
		label.on('enterframe', function(){
			label.text = score;
		});
		scene.addChild(label);
		
		
		var label0 = new Label();
		label0.x = 20;
		label0.y = 5;
		label0.color = 'red';
		label0.font = '14px "Arial"';
		label0.text = '0';
		label0.on('enterframe', function(){
			label0.text = (game.frame / game.fps).toFixed(2);
		});
		scene.addChild(label0);
		
		//フレームごとの処理
		scene.on("enterframe", function(){
			//ｸﾏｰの操作
			ContPos(pos[0],pos[1],pos[2],pos[3]);
			//トラップ発動
			if((game.frame - start_frame) % (FPS*v) == 1){ // 秒数(frame/fps)ではなくframe判定により動作が安定
				if(ptn == 0){
					Execute();
				} else{
					AnotherExecute();
				}
				scene.addChild(kuma);
			}
		});

		return scene;
	};
	
	makeResultScene = function(score){
		scene = new Scene();
		
		var title = new Sprite( 189, 97 );
		title.image = game.assets[LOGO[1]];
		title.frame = 0;
		title.moveTo( WIDTH/2-title.width/2, title.height/2 );
		title.addEventListener( Event.TOUCH_END, function() {
			game.replaceScene(makeTitleScene());	
		});
		scene.addChild( title );
		
		scene.addEventListener('enterframe', function(){
			if(game.input.z || game.input.x || game.input.y){
				game.replaceScene(makeTitleScene());
			}
		});
		
		var result = new Label('Your Score : ' + score);
		result.font = '20px "ＭＳ Ｐゴシック"';
		result.color = "black";
		result.x = 52;
		result.y = title.height * 2;
		scene.addChild(result);
		
		return scene;
	};
	
	game.start();
};

function rand(max, min){
	if (typeof min === "undefined") { min = 0;}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
function randExcept(max, min, ex){
	if(typeof min === "undefined") {min = 0;}
	var result = rand(max, min);
	while(ex == result) {result = rand(min, max);}
	return result;
}
*/