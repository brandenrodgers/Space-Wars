			// Branden Rodgers
			
			//Create player object
			var player = new Object;
			player['position'];
			player['health'];
			player['dead'];
			
			//Enemy object
			var enemy = new Object;
			var enemies = new Array();
           
			//Speed options
			var speed = new Object;
			speed['easy'] = 100;
			speed['medium'] = 75;
			speed['hard'] = 50;
			player['speed'];
			
			//Directions for players to move
			var direction = new Object;
			direction['up'] = [0,-10];
			direction['down'] = [0,10];
			direction['left'] = [-10,0];
			direction['right'] = [10,0];
			direction['still'] = [0,0];
			player['direction'];
			enemy['direction']
			var score;
			var healthbox;
			
			//Power up objects 
			var power_up = new Object;
			power_up['position'];
			power_up['type'];
			power_up['draw'] = function(context) {
				var image = new Image();
				image.src = power_up['type']+ ".png";
				context.drawImage(image,power_up['position'][0],power_up['position'][1]);
			};
			
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
				img[8].src = 'enemy.png';
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
				score += (3000 / (speed[player['speed']]))*(power_up[power_up['type']]);
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
					player['position'][0] = 400;
				} 
				else if (player['position'][0] > 400)
				{
					player['position'][0] = 0;
				} 
				else if (player['position'][1] < 0)
				{
					player['position'][1] = 400;
				}
				else if (player['position'][1] > 400)
				{
					player['position'][1] = 0;
				}
				

				player['position'][0] += direction[player['direction']][0];
				player['position'][1] += direction[player['direction']][1];
				// too pythonic --> player['position'] = (a+b for a, b in player['position'], direction[player['direction']])
			}

			//Move enemy towards player
			function move_enemy()
			{			
				for(var i = 0;i<enemies.length;i++)
				{
					if (player['position'][0] > enemies[i][0])
					{
						enemies[i][0] += 5;
					} 
					else if (player['position'][0] < enemies[i][0])
					{
						enemies[i][0] -= 5;
					}
				
					if (player['position'][1] > enemies[i][1])
					{
						enemies[i][1] += 5;
					} 
					else if (player['position'][1] < enemies[i][1])
					{
						enemies[i][1] -= 5;
					}
				}
				//adjust_enemy();
			}

			function adjust_enemy()
			{
                for(var x = 0;x<enemies.length;x++)
				{
				 	for(var i = 1;i<enemies.length;i++)
					{
				 		if (enemies[x][0] == enemies[i][0] && enemies[x][1] == enemies[i][1])
				 		{
				 			var axis = Math.floor((Math.random() * 2) + 1);
				 		    if (axis == 2)
				 		    {
				 		    	enemies[x][0] += 5;
				 		    }
				 		    else 
				 		    {
				 		    	enemies[x][1] += 5;
				 		    }
				 			break;
				 		}
					}
				}
			}
		
		    function activate_power_up()
		    {
		    	if (power_up['type'] == "apple")
		    	{
		    		player['health'] += 1;
		    	}
		    	else {
		    		player['health'] += 1;
		    	}
		    }

			//Check collisions (walls/powerups/enemies)
			function check_collision()
			{
				
				if(power_up['position'][0] == player['position'][0] && power_up['position'][1] == player['position'][1])
				{	
					update_score();
					activate_power_up();
					make_power_up();
					make_enemy();
				} 
				   
				for(var i = 0;i<enemies.length;i++)
				{
					if (player['position'][0] == enemies[i][0] && player['position'][1] == enemies[i][1])
				{
					player['health'] -= 1;
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
            	var pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
				while(!check_pos_valid(pos))
 				{
					pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
				}
				enemies[enemies.length] = new Array(pos[0]*10,pos[1]*10);
				

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
					else {
						player['direction'] = 'still';
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
                
                for(var i = 0;i<enemies.length;i++)
				{
                var enemy_image = new Image();
				enemy_image.src = "enemy.png";
				context.drawImage(enemy_image,enemies[i][0],enemies[i][1]);
				}
			
			}

			function step()
			{
				move_player();
				move_enemy();
				check_collision();
				check_health();
				draw();
				if(player['dead'])
				{
					document.getElementById("result").innerHTML = "GAME OVER";
					document.getElementById("button").style.visibility = 'visible';
					check_score();
					print_scores();
				}
				else
				{
					wait_for_step();
				}

			}
			function wait_for_step()
			{
				setTimeout('step()',speed[player['speed']]);
			}
			
			function game()
			{
				enemies.length = 0;
				player['position'] = [40,10];
				player['speed'] = document.getElementById("speed").value;
				player['direction'] = 'right';
				player['dead'] = false;
				player['health'] = 5;
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
