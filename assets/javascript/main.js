$( document ).ready(function() {
	initialize();
	$('#attack-button').on('click',function(){attack()});

});

function attack(){
	if(gameStarted === true){
		//PLAYER HITS FIRST
		//ATTACK MULTIPLER
		thisAttack = player.attack * player.attackMultipler;
		//DECREMENT ENEMY HEALTH
		enemy.health -= thisAttack;
		//INCREMENT ATTACK MULTIPLIER
		player.attackMultipler++;
		//DISPLAY PLAYER ATTACK
		$('#attackText').html('<h3>'+player.name + ' attacked ' + enemy.name + ' for ' + thisAttack + 'hp</h3>');

		if(enemy.health <= 0){//IF ENEMY IS DEFEATED
			//NULL OUT ENEMY HEALTH
			$('#health-'+enemy.varname).html('--');
			
			//GET THE ENEMY ELEMENT
			function findEnemy(char) { 
				return char.varname === enemy.varname;
			}
			//SET ARRAY OF AVAILABLE ENEMIES BY REMOVING THE ONE DEFEATED
			enemyPosition = enemyArray.findIndex(findEnemy); //FIND DEFEATED ENEMY TO REMOVE FROM ENEMY ARRAY
			enemyArray.splice(enemyPosition,1);//REMOVE DEFEATED ENEMY
			//GAME NO LONGER STARTED
			gameStarted = false;
			//CLEAR THE BATTLEFIELD
			$('#battlefield').html('');

			if($(enemyArray).length > 0){//IF THERE ARE ANY ENEMIES LEFT TO DEFEAT
				$('#counterAttackText').html('<h3>You have defeated ' + enemy.name + '. Select a new defender.</h3>');
			}else{//YOU BEAT THE GAME!
				$('#counterAttackText').html('<h3>You have defeated ' + enemy.name + ' and all other enemies.</h3> <button class="btn-danger" onclick="initialize()">Click here to play again</button>');
			}

		}else{//ENEMY NOT DEFEATED - THEY HIT BACK
			//SET ENEMY HEALTH HTML
			$('#health-'+enemy.varname).html(enemy.health);		
			//ENEMY HITS BACK
			//Set a counterattack variable
			thisCounterAttack = selectedEnemy.counterAttack;
			console.log('player health is ' + player.health);
			console.log('counterAttack is' + thisCounterAttack);
			player.health -= thisCounterAttack;
			console.log('new player health is' + player.health)

			if(player.health <= 0){
				$('#counterAttackText').html('<h3>' + enemy.name + ' has attacked you for ' + enemy.counterAttack + 'hp. You have been defeated. <button class="btn-danger" onclick="initialize()">Click here to play again</button></h3>');
			}else{
				$('#counterAttackText').html('<h3>' + enemy.name + ' has attacked you for ' + enemy.counterAttack + 'hp</h3>');
			}
		}
		$('#health-'+player.varname).html(player.health);
	}
}

var player = {
	health : null,
	attack : null,
	attackMultipler : 1,
	imgSrc : null,
	name: null
};

var enemy = {
	health : null,
	attack : null,
	counterAttack: null,
	imgSrc : null,
	name: null
}

//MR. BLONDE
var blonde = {
  health: 80,
  attack: 80,
  attackMultipler : 1,
  counterAttack: 40,
  imgSrc: "assets/images/BLONDE.jpg",
  name: "Mr. Blonde",
  varname : 'blonde'
};

//MR. ORANGE
var orange = {
  health: 125,
  attack: 40,
  attackMultipler : 1,
  counterAttack: 20,
  imgSrc: "assets/images/ORANGE.jpg",
  name: "Mr. Orange",
  varname : 'orange'
};

//MR. WHITE
var white = {
  health: 200,
  attack: 20,
  attackMultipler : 1,
  counterAttack: 10,
  imgSrc: "assets/images/WHITE.jpg",
  name: "Mr. White",
  varname : 'white'
};

//MR. PINK
var pink = {
  health: 100,
  attack: 60,
  attackMultipler : 1,
  counterAttack: 30,
  imgSrc: "assets/images/PINK.jpg",
  name: "Mr. Pink",
  varname : 'pink'
};


var gameStarted = false;
var playerSelected = false;
var charArray = [];
var availableCharacters;
var enemyArray;



function initialize(){
	$('#characterRow').html('');
	$('#attackText').html('');
	$('#counterAttackText').html('');
	$('#battlefield').html('');
	charArray = [blonde, orange, white, pink];
	gameStarted = false;
	playerSelected = false;

	availableCharacters = charArray; //Reset available characters;
	$(charArray).each(function(key,thisChar){//Build each character	
		//Character Div Attributes
		var characterDivAttributes = {
			data : { health : this.health, attack : this.attack, counterAttack : this.counterAttack},
			'class' : 'col-xs-1 character text-center',
			'id' : this.varname
		}
		//Character Name Div
		var characterDiv = $('<div>', characterDivAttributes); 
		//Character Name Tag
		var nameTag = $('<div>', {'class' : 'characterTag'}).html(this.name);
		characterDiv.append(nameTag);
		//Character Image
		var characterImage = $('<img>').attr({'src' : this.imgSrc, 'class' : 'characterImage img-responsive'});
		$(characterDiv).append(characterImage);
		//Character Health Tag
		var healthTag = $('<div>').attr({'id' : 'health-'+this.varname, 'class' : 'characterTag'}).html(this.health);
		$(characterDiv).append(healthTag);
		$('#characterRow').append(characterDiv);//Add character to the row of characters
	});

	$('.character').click(function(){
		characterSelect(this);//When a character is clicked, fire off the select function
	})

}


function characterSelect(characterObj){
	var thisID = characterObj.id;
	if(gameStarted === false && playerSelected === false){		//GAME NOT IN PROGRESS - PLAYER SELECT
		//SET SELECTED CHARACTER ATTRIBUTES
		selectedCharacter = eval(thisID);
		player.health = selectedCharacter.health;
		player.attack = selectedCharacter.attack;
		player.name = selectedCharacter.name;
		player.varname = selectedCharacter.varname;
		function findCharacter(char) { 
			return char.varname === thisID;
		}
		//SET ARRAY OF AVAILABLE ENEMIES
		charPosition = charArray.findIndex(findCharacter); //FIND SELECTED ATTACKER TO REMOVE FROM ENEMY ARRAY
		enemyArray = charArray; //SET ENEMY ARRAY
		enemyArray.splice(charPosition,1);//REMOVE SELECTED ATTACKER
		$(enemyArray).each(function(key,thisEnemy){//TAKE THE REMAINING CHARACTERS, BY ID, TURN BORDER RED AND MOVE THEM TO THE ENEMY SELECT AREA
			$('#enemyRow').append($('#'+thisEnemy.varname));
			//$('#'+thisEnemy.varname).addClass('redborder')
		});
		playerSelected = true;//SET PLAYER SELECTED VARIABLE
	}else if(gameStarted === false && playerSelected === true && thisID != player.varname){ //GAME NOT IN PROGRESS - ENEMY SELECT
		//SET SELEECTED ENEMY ATTRIBUTES
		$('#attackText').html('');
		$('#counterAttackText').html('');
		selectedEnemy = eval(thisID);
		enemy.health = selectedEnemy.health;
		enemy.counterAttack = selectedEnemy.counterAttack;
		enemy.name = selectedEnemy.name;
		enemy.varname = selectedEnemy.varname
		console.log(selectedEnemy)
		$('#battlefield').append($('#'+selectedEnemy.varname));//SEND THE ENEMY TO THE BATTLEFIELD
		gameStarted = true; //WITH BOTH PLAYER AND ENEMY SELECTED, THE GAME BEGINS
	}//ELSE IGNORE CLICK
}

