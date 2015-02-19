// Branden Rodgers
			
//Sounds
var background_music = new Audio("backgroundmusic.wav");
var laser = new Audio("laser.wav");
var crash = new Audio("crash.wav");
var powerup = new Audio("powerup.wav");
var explode = new Audio("explode.wav");
var warp = new Audio("warp.wav");
var shield_sound = new Audio("shield.wav");
var rocket_sound = new Audio("rocket.wav");

//Create player object
var player = new Object;
player['position'];
player['health'];
player['dead'];
player['state']
			
//Enemy object
function enemy(position, direction){
	this.position = position;
	this.direction = direction;
}

var enemies = new Array();
var enemy_spawn = 25;

//Speed options
var speed = new Object;
speed['easy'] = 50;
speed['medium'] = 40;
speed['hard'] = 30;
player['speed'];

//missiles
function missile(position, direction, caliber){
	this.position = position;
	this.direction = direction;
	this.caliber = caliber;
}
var missiles = new Array();
var missile_timer = 0;
var missile_caliber = "regular";

//Enemy object
function explosion(position, duration, e_size){
	this.position = position;
	this.duration = duration;
	this.e_size = e_size;
}

var explosions = new Array();

//Directions for players to move
var direction = new Object;
direction['up'] = [0,-4];
direction['down'] = [0,4];
direction['left'] = [-4,0];
direction['right'] = [4,0];
direction['still'] = [0,0];
player['direction'];
enemy['direction']


var score;
var effect = "";
			
//Power up objects 
var power_up = new Object;
power_up['position'];
power_up['type'];
power_up['draw'] = function(context) {
	var image = new Image();
	image.src = power_up['type']+ ".png";
	context.drawImage(image,power_up['position'][0],power_up['position'][1]);
};

var score_multiplier = 1;
power_up['cherry'] = 50;
power_up['apple'] = 10;
power_up['grape'] = 5;
power_up['banana'] = 2;
power_up['onion'] = 1;

//High scores and local storage
var highscores = new Array();
var localStorage = supports_html5_storage();

// preload images
if (document.images)
{
	var img = new Array();
	img[0] = new Image();
	img[0].src = 'apple.png';
	img[1] = new Image();
	img[1].src = 'banana.png';
	img[2] = new Image();
	img[2].src = 'cherry.png';
	img[3] = new Image();
	img[3].src = 'grape.png';
	img[4] = new Image();
	img[4].src = 'shipup.png';
	img[5] = new Image();
	img[5].src = 'shipleft.png';
	img[6] = new Image();
	img[6].src = 'shipdown.png';
	img[7] = new Image();
	img[7].src = 'shipright.png';
	img[8] = new Image();
	img[8].src = 'enemyup.png';
	img[9] = new Image();
	img[9].src = 'enemydown.png';
	img[10] = new Image();
	img[10].src = 'enemyleft.png';
	img[11] = new Image();
	img[11].src = 'enemyright.png';
	img[12] = new Image();
	img[12].src = 'enemyupleft.png';
	img[13] = new Image();
	img[13].src = 'enemyupright.png';
	img[14] = new Image();
	img[14].src = 'enemydownleft.png';
	img[15] = new Image();
	img[15].src = 'enemydownright.png';
	img[16] = new Image();
	img[16].src = 'missileup.png';
	img[17] = new Image();
	img[17].src = 'missiledown.png';
	img[18] = new Image();
	img[18].src = 'missileleft.png';
	img[19] = new Image();
	img[19].src = 'missileright.png';
}


function setup()
{
	for(var i = 0;i<localStorage.length;i++)
	{
		highscores[i] = localStorage[i];
	}
	print_scores();
}
function supports_html5_storage() 
{
	try 
	{
    		return 'localStorage' in window && window['localStorage'] !== null;
  	} 
  	catch (e) 
  	{
    		return false;
  	}
}

function submit()
{
	highscores[highscores.length] = score;
	highscores.sort(function (one, other) {
		return other - one;
	});
}
function check_score()
{
	if(highscores.length < 5)
	{
		submit();
	}
	else
	{
		submit();
		highscores.pop();
	}
}
function print_scores()
{
	for(var i = 0;i < highscores.length;i++)
	{
		document.getElementById("score"+ (i+1)).innerHTML = highscores[i];
		if(localStorage)
		{
			localStorage[i] = highscores[i];
		}
	}
}
function update_score()
{
	score += (50 * score_multiplier)
	document.getElementById("score").innerHTML = score;
}

function update_health()
{
	document.getElementById("healthbox").innerHTML = "Health: " + player['health'];
}

	//Move player in direction
function move_player()
{			
	if (player['position'][0] < 0)
	{
		warp.currentTime = 0;
		warp.play();
		player['position'][0] = 392;
	} 
	else if (player['position'][0] > 392)
	{
		warp.currentTime = 0;
		warp.play();
		player['position'][0] = 0;
	} 
	else if (player['position'][1] < 0)
	{
		warp.currentTime = 0;
		warp.play();
		player['position'][1] = 392;
	}
	else if (player['position'][1] > 392)
	{
		warp.currentTime = 0;
		warp.play();
		player['position'][1] = 0;
	}
	

	player['position'][0] += direction[player['direction']][0];
	player['position'][1] += direction[player['direction']][1];
}

//Move missiles shot by player
function move_missiles()
{			
	missile_timer -= 1;
	for(var i = 0;i<missiles.length;i++)
	{
		if (missiles[i]['direction'] == 'right')
		{
			missiles[i]['position'][0] += 10;
		}
		else if (missiles[i]['direction'] == 'left')
		{
			missiles[i]['position'][0] -= 10;
		}
		else if (missiles[i]['direction'] == 'up')
		{
			missiles[i]['position'][1] -= 10;
		}
		else if (missiles[i]['direction'] == 'down')
		{
			missiles[i]['position'][1] += 10;
		}
	}
}

//Move enemy towards player
function move_enemy()
{			
	for(var i = 0;i<enemies.length;i++)
	{
		if (player['position'][0] > enemies[i]['position'][0] && player['position'][1] > enemies[i]['position'][1])
		{
			enemies[i]['position'][0] += 2;
			enemies[i]['position'][1] += 2;
			enemies[i]['direction'] = 'downright';

		} 
		else if (player['position'][0] < enemies[i]['position'][0] && player['position'][1] < enemies[i]['position'][1])
		{
			enemies[i]['position'][0] -= 2;
			enemies[i]['position'][1] -= 2;
			enemies[i]['direction'] = 'upleft';
		}
		else if (player['position'][0] > enemies[i]['position'][0] && player['position'][1] < enemies[i]['position'][1])
		{
			enemies[i]['position'][0] += 2;
			enemies[i]['position'][1] -= 2;
			enemies[i]['direction'] = 'upright';
		}
		else if (player['position'][0] < enemies[i]['position'][0] && player['position'][1] > enemies[i]['position'][1])
		{
			enemies[i]['position'][0] -= 2;
			enemies[i]['position'][1] += 2;
			enemies[i]['direction'] = 'downleft';
		}
	    else if (player['position'][0] > enemies[i]['position'][0])
		{
			enemies[i]['position'][0] += 2;
			enemies[i]['direction'] = 'right';
		} 
		else if (player['position'][0] < enemies[i]['position'][0])
		{
			enemies[i]['position'][0] -= 2;
			enemies[i]['direction'] = 'left';
		}
		else if (player['position'][1] > enemies[i]['position'][1])
		{
			enemies[i]['position'][1] += 2;
			enemies[i]['direction'] = 'down';
		}
		else if (player['position'][1] < enemies[i]['position'][1])
		{
			enemies[i]['position'][1] -= 2;
			enemies[i]['direction'] = 'up';
		}
	}
}


function activate_power_up()
{
	if (power_up['type'] == "apple")
	{
		player['health'] += 1;
		score_multiplier = 1;
		player['shield'] = 0;
		effect = "Health + 1";
		missile_caliber = "regular";
	}
	else if (power_up['type'] == "onion")
	{
		score_multiplier = 1;
		player['shield'] = 0;
		effect = "Rockets";
		missile_caliber = "rocket";
	}
	else if (power_up['type'] == "banana")
	{
		score_multiplier = 1;
		effect = "Shield 5";
		player['shield'] = 5;
		missile_caliber = "regular";
	}
	else 
	{
		score_multiplier = 2;
		player['shield'] = 0;
		missile_caliber = "regular";
		effect = "score 2x";
	}
	document.getElementById("currenteffect").innerHTML = effect;
}

//Check collisions (enemies, missiles, power_ups)
function check_collision()
{
	var missile_hit = false;
	//player -> power ups
	if(Math.abs(power_up['position'][0] - player['position'][0]) <= 5 && 
		Math.abs(power_up['position'][1] - player['position'][1]) <= 5)
	{	
		powerup.play();
		activate_power_up();
		make_power_up();
	} 
	   
	 //player -> enemy  
	for(var i = 0;i<enemies.length;i++)
	{
		if (player['position'][0] == enemies[i]['position'][0] && player['position'][1] == enemies[i]['position'][1])
		{
			if (player['shield'] <= 0)
			{
				player['health'] -= 1;
				crash.currentTime = 0;
				crash.play();
				break;
			}
			else
			{
				shield_sound.currentTime = 0;
				shield_sound.play();
				player['shield'] -= 1;
				effect = "Shield " + player['shield'];
				document.getElementById("currenteffect").innerHTML = effect;
			}

		}	
	}	

	//missile -> enemy  
	if (missile_caliber ==  "regular")
	{
		for(var i = 0;i<missiles.length;i++)
		{
			for(var e = 0;e<enemies.length;e++)
			{
				
				if (missiles[i]['direction'] == 'left' || missiles[i]['direction'] == 'right')
				{
					if (Math.abs(missiles[i]['position'][0] - enemies[e]['position'][0]) <= 6 && 
						missiles[i]['position'][1] == enemies[e]['position'][1])
					{
						make_explosion(enemies[e]['position'][0], enemies[e]['position'][1], "small");
						enemies.splice(e, 1);
						missiles.splice(i, 1);
						update_score();
						break;
					}
				}
				else
				{
					if (missiles[i]['position'][0] == enemies[e]['position'][0] && 
						Math.abs(missiles[i]['position'][1] - enemies[e]['position'][1]) <= 6)
					{
						make_explosion(enemies[e]['position'][0], enemies[e]['position'][1], "small");
						enemies.splice(e, 1);
						missiles.splice(i, 1);
						update_score();
						break;
					}
				}
			}
		}
	}
	else 
	{
		for(var i = 0;i<missiles.length;i++)
		{
			missile_hit = false;
			for(var e = 0;e<enemies.length;e++)
			{
		        if (Math.abs(missiles[i]['position'][0] - enemies[e]['position'][0]) <= 25 && 
					Math.abs(missiles[i]['position'][1] - enemies[e]['position'][1]) <= 25)
				{
					make_explosion(enemies[e]['position'][0], enemies[e]['position'][1], "big");
					enemies.splice(e, 1);
					update_score();
					missile_hit = true;
				}
			}
			if (missile_hit)
			{
				missiles.splice(i, 1);
			}
			
		}
	} 

	update_health();
}

//Check if health = 0
function check_health()
{
	if(player['health'] <= 0){
		player['dead'] = true;
	}
}

function check_pos_valid(pos)
{
	return true;
}

//Create power up at random position
function make_explosion(x, y, s)
{
	var explosion1 = new explosion([x, y], 10, s);
	explosions[explosions.length] = explosion1;
	explode.currentTime = 0;
	explode.play();
}


//Create power up at random position
function make_power_up()
{
	var pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
	while(!check_pos_valid(pos))
		{
		pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
	}
	power_up['position'] = new Array(pos[0]*10,pos[1]*10);
	var num = Math.floor(Math.random()*50+1);
	if(num % power_up['cherry'] == 0)
	{
		power_up['type'] = 'cherry';
	}
	else if(num % power_up['apple'] == 0)
	{
		power_up['type'] = 'apple';
	}
	else if(num % power_up['grape'] == 0)
	{
		power_up['type'] = 'grape';
	}
	else if(num % power_up['banana'] == 0)
	{
		power_up['type'] = 'banana'; 
	}
	else
	{
		power_up['type'] = 'onion';
	}
}

function make_enemy()
{
	if (enemy_spawn <= 1)
	{
	var pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
	while(!check_pos_valid(pos))
		{
		pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
	}
	var enemy1 = new enemy(new Array(pos[0]*10,pos[1]*10), 'up');
	enemies[enemies.length] = enemy1;
	enemy_spawn = 25;
	}
	else 
	{
		enemy_spawn -= 1;
	}
}

function make_missile()
{
	if (missile_timer <= 0)
	{
		var missile1 = new missile([player['position'][0], player['position'][1]], player['direction'], missile_caliber);
		missiles[missiles.length] = missile1;
		missile_timer = 5;
		if (missile_caliber == "regular")
		{
			laser.currentTime = 0;
			laser.play();
		}
		else 
		{
			rocket_sound.currentTime = 0;
			rocket_sound.play();
		}
	}
}

function keyListener(e)
{
	if(!player['dead'])
	{
		if(!e)
		{
			e = window.event;
		}
		if(e.keyCode == 38)
		{
			player['direction'] = 'up';
		}		
		else if(e.keyCode == 40)
		{
			player['direction'] = 'down';
		}
		else if(e.keyCode == 37)
		{
			player['direction'] = 'left';
		}
		else if(e.keyCode == 39)
		{
			player['direction'] = 'right';
		}
		else if(e.keyCode == 68)
		{
			player['direction'] = 'still';
		}

		if (e.keyCode == 32)
		{
			make_missile();
		}
	}
}

function update_mis_exp()
{
	for(var i = 0;i<explosions.length;i++)
	{
		if (explosions[i]['duration'] == 0)
		{
			explosions.splice(i, 1);
		}
		else 
		{
			explosions[i]['duration'] -= 1;
		}
	}

	for(var i = 0;i<missiles.length;i++)
	{
		if (missiles[i]['position'][0] < 0 || missiles[i]['position'][0] > 400 ||
			missiles[i]['position'][1] < 0 || missiles[i]['position'][1] > 400)
		{
			missiles.splice(i, 1);
		}
	}

}

function draw()
{
	var canvas = document.getElementById("screen");
	var context = canvas.getContext("2d");
	context.clearRect(0,0,400,400);
	var player_image = new Image();
	
	player_image.src = "ship" + player['direction'] + ".png";
	context.drawImage(player_image,player['position'][0],player['position'][1]);
	power_up['draw'](context);
    
    //Draw enemies
    for(var i = 0;i<enemies.length;i++)
	{
    var enemy_image = new Image();
	enemy_image.src = "enemy" + enemies[i]['direction'] + ".png";
	context.drawImage(enemy_image,enemies[i]['position'][0],enemies[i]['position'][1]);
	}

	//Draw missiles
	for(var i = 0;i<missiles.length;i++)
	{
    var missile_image = new Image();
	missile_image.src = missile_caliber + "missile" + missiles[i]['direction'] + ".png";
	context.drawImage(missile_image,missiles[i]['position'][0],missiles[i]['position'][1]);
	}

	//Draw explosions
	for(var i = 0;i<explosions.length;i++)
	{
    var explosion_image = new Image();
	explosion_image.src = explosions[i]['e_size'] + "explosion.png";
	context.drawImage(explosion_image,explosions[i]['position'][0],explosions[i]['position'][1]);
	}

}

function step()
{
	move_player();
	move_enemy();
	make_enemy();
	move_missiles();
	check_collision();
	check_health();
	update_mis_exp(); //update missiles and explosions
	draw();
	if(player['dead'])
	{
		document.getElementById("result").innerHTML = "GAME OVER";
		document.getElementById("button").style.visibility = 'visible';
		check_score();
		print_scores();
		background_music.pause();
	}
	else
	{
		if (background_music.paused)
		{
			background_music.play();
		}
		wait_for_step();
	}

}
function wait_for_step()
{
	setTimeout('step()',speed[player['speed']]);
}

function game()
{
    background_music.play();
	enemies.length = 0;
	missiles.length = 0;
	player['position'] = [40,10];
	player['speed'] = document.getElementById("speed").value;
	player['direction'] = 'right';
	player['dead'] = false;
	player['health'] = 5;
	player['shield'] = 0;
	score = 0;
	document.getElementById("button").style.visibility = 'hidden';
	document.getElementById("result").innerHTML = "";
	document.onkeydown = keyListener;
	document.getElementById("score").innerHTML = score;
	update_health();
	make_power_up();
	make_enemy();
	draw();
	wait_for_step();
}
