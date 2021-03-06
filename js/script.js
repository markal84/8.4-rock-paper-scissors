'use strict';

//variables

  //main buttons
var paper = document.getElementById('paper');
var rock = document.getElementById('rock');
var scissors = document.getElementById('scissors');
var buttons = document.getElementsByClassName('player-move'); // wszystkie buttony gracza
var newGame = document.getElementById('newGame'); // przycisk new game

  //outputs
var output = document.getElementById('output'); // pole do wyswietlania wyniku meczu
var result = document.getElementById('result'); // pole do wyswietlania liczby wygranych rund
var modalOutput = document.getElementById('modal-one-content'); //pole do wyswietlania wyniku meczu w modalu
var modalSummary = document.getElementById('modal-one'); // modal z wynikami i przebiegiem gry pokazywanym w tabeli

  //moves
var computerButton; // do przypisania random liczby do rock, paper,scissors w funkcji computerMove
var preventGame; //do wykorzystania w funkcji blokujaca dalsza gre, zmienna ktora ma wlasciwosci true lub false 


  //main variable 
var params = {
    playerRounds : 0, //number of player rounds
    computerRounds : 0, //number of computer rounds
    noTurns: '', //number of turns set while clicking new game button
    noRounds: 0, // round number
    progress: [], //pusta tablica sluzaca do zapisywania parametrow rozgrywki
    playerCurrentMove: '', // zmienna przechowujaca ruch gracza w danej turze
    computerCurrentMove: '', //zmienna przechowujaca ruch komputera w danej turze
    roundStatus: '' //zmienna ktora bedzie wyswietlac won/lost lub draw dla danej rundy    
};


//functions

  //funkcja sluzaca do tworzenia obiektu i dodawania wartosci kluczow do obiektu
var pushValues = function(){
  var values = { // tworzymy zmienna values przechowujaca parametry rundy ( moze trzeba ja zadeklarowac globalnie zamiast w funkcji)
    noRound: params.noRounds,
    playerMove: params.playerCurrentMove,
    computerMove: params.computerCurrentMove,
    roundResult: params.roundStatus,
    matchResult:'You: '+ (params.playerRounds) + ' - ' + 'Comp: '+ (params.computerRounds)
  };
  //funkcja ktora dodaje obiekt z parametrami rundy do tabliby progress
  params.progress.push(values); // dodajemy parametry rundy do tablicy params.progress po kazdym kliknieciu w button
  console.log(params.progress);
};


// funkcja tworzaca tabele
function createTable() {
  var tbl = document.getElementById("table-score");
  tbl.innerHTML = '';
  tbl.innerHTML =
    "<tr><th>Round nr</th><th>Player move</th><th>Computer move</th><th>Round result</th><th>Match result</th></tr>";
 
  for (var i = 0; i < params.progress.length; i++) {
    tbl.innerHTML +=
    "<tr><td>" +
    params.progress[i].noRound  +
    "</td><td>" +
    params.progress[i].playerMove +
    "</td><td>" +
    params.progress[i].computerMove +
    "</td><td>" +
    params.progress[i].roundResult +
    "</td><td>" +
    params.progress[i].matchResult +
    "</td></tr>";
  }
}


//funkcja playerMove - glowna funkcja
function playerMove(buttonClicked) {
    params.playerCurrentMove = buttonClicked; // dzieki temu do zmiennej w params trafi aktualny ruch gracza
    computerMove();
    params.noRounds++; // each click increase round number
    switch (buttonClicked + computerButton) { //funkcja decydujaca o wyniku
        case 'rockscissors':
        case 'paperrock':
        case 'scissorspaper':
            params.roundStatus = 'You Won';
            displayText('YOU WON! : You played ' + '<b>' + buttonClicked + '</b>' + ', computer played ' + '<b>' + computerButton + '</b>');
            params.playerRounds++;
            //console.log('player won games: '+ params.playerRounds);
            displayWonRounds();
            pushValues();
            //console.log(params.progress[0].matchResult);
            checkIfWon();
            createTable(); // funkcja tworzenia tablicy
            break;
        case 'rockpaper':
        case 'paperscissors':
        case 'scissorsrock':
            params.roundStatus = 'You Lost';
            displayText('YOU LOST! : You played ' + '<b>' + buttonClicked + '</b>' + ', computer played ' + '<b>' + computerButton + '</b>');
            params.computerRounds++;
            //console.log('computer won games: '+ params.computerRounds);
            displayWonRounds();
            pushValues();
            checkIfWon();
            createTable(); // funkcja tworzenia tablicy
            break;
        case 'rockrock':
        case 'paperpaper':
        case 'scissorsscissors':
            params.roundStatus = 'Draw';
            displayText('DRAW! : You played ' + '<b>' + buttonClicked + '</b>' + ', computer also played ' + '<b>' + computerButton + '</b>');
            pushValues();
            createTable(); // funkcja tworzenia tablicy
            break;             
    }; 
};

// petla przechodzaca przez wszystkie buttony i uruchamiajaca funkcje playerMove z opdpowiednim argumentem, zastepuje funkcje playerChoice();
for ( var i = 0; i < buttons.length; i++ ) { // dla kazdego buttona
    buttons[i].addEventListener('click', function (){ playerMove(this.getAttribute('data-move')); // po kliknieciu w button uruchom funkcje ktora zczytuje wartosc parametru data-move ktorego wartosciami sa, w zaleznosci od kliknietego buttona - rock,parer,scissorss
    });
}; 


  //funkcja losująca liczby od 1 do 3 i przypisujaca im wartosci
function computerMove(){
     var computerChoice = Math.floor((Math.random() * 3) + 1);
     if(computerChoice == 1){
         computerButton = 'paper';
     }else if(computerChoice == 2){
        computerButton = 'rock';
     }else{
        computerButton = 'scissors';
     }
     params.computerCurrentMove = computerButton; // dzieki temu do zmiennej w params trafi aktualny ruch komputera
     return computerChoice;
};
  

  //funkcja wyswietlajaca tekst w output 
  var displayText = function(text) {
    output.innerHTML = output.innerHTML + text + '<br>';
  }; 

  //funkcja wyswietlajaca liczbe wygranych rund
  var displayWonRounds = function() { 
      clearTextWonRounds();
      result.innerHTML = result.innerHTML + 'Number of won rounds: '+'<br><br>' + '<b>' + 'Player: ' + '</b>' + params.playerRounds + '<b>' + ' Computer: ' + '</b>' + params.computerRounds + '<br><br>';
  };

  //funkcja czysczaca text w WonRounds
    function clearTextWonRounds(){
        result.innerHTML = '';
    };
  
  //funkcja zczytujaca wartosc z newGame i wyswietlajaca komunikat w polu result
  newGame.addEventListener('click', function(){ 
    params.noTurns = window.prompt('Plase specify number of turns necessery to win the game');
    if(isNaN(params.noTurns) || params.noTurns == '' || params.noTurns == null || params.noTurns == 0 || params.noTurns == 1)
    {
        displayText('Can only be a number and larger than 1!');
    } else {
        displayRounds();
        paper.style.visibility = "visible";
        rock.style.visibility = "visible";
        scissors.style.visibility = "visible";
    }
  });
  //funkcja wyswietlajaca liczbe ustalonych rund
    var displayRounds = function(){
      result.innerHTML = ('');
      result.insertAdjacentHTML('beforebegin','Numbers of turns to win the game is: ' + '<b>' + params.noTurns + '</b>' + '<br><br>');
      };
        //funkcja czysczaca liczbe rund w result
    function clearRounds(){
        //result.insertAdjacentHTML('beforebegin','');
        params.playerRounds = 0;
        params.computerRounds = 0;
    };    

    function showModal(){ // funkcja pokazujaca modal
        document.querySelector('#modal-overlay').classList.add('show');
        modalSummary.classList.add('show');
    };

  //funkcja ktora sprawdza czy gracz lub komputer nie ma wiekszego score niz liczba rund i blokuje gre jesli score jest osiagniety
  function checkIfWon(){
    if(params.playerRounds == params.noTurns){
        //wyswietlenie wygranej gracza
        //output.insertAdjacentHTML('beforebegin','<b>' + 'You won the entire game!' + '</b>'+ '<br>' + ' Press NEW GAME button to play again'+'<br>');
        modalOutput.innerHTML = ('');
        modalOutput.insertAdjacentHTML('afterbegin','<br>' + '<b>' + 'You won the entire game!' + '</b>'+ '<br><br>' + ' Press NEW GAME button to play again'+'<br>');
        output.innerHTML = '';
        result.innerHTML = '';
        showModal();
        clearRounds();
        paper.style.visibility = "hidden";
        rock.style.visibility = "hidden";
        scissors.style.visibility = "hidden";

    }else if(params.computerRounds == params.noTurns){
        //wyswietlenie wygranej komputera
        //output.insertAdjacentHTML('beforebegin','<b>' + 'You lost the game!' + '</b>'+ '<br>' + ' Press NEW GAME button to play again'+'<br>');
        modalOutput.innerHTML = ('');
        modalOutput.insertAdjacentHTML('afterbegin','<br>' + '<b>' + 'You lost the game!' + '</b>'+ '<br><br>' + ' Press NEW GAME button to play again'+'<br>');
        output.innerHTML = '';
        result.innerHTML = '';
        showModal();
        clearRounds();
        paper.style.visibility = "hidden";
        rock.style.visibility = "hidden";
        scissors.style.visibility = "hidden";
    }else{
        //console.log('draw');
    }
  };

// modals code

(function(){ 
	
	var showModal = function(event){
		event.preventDefault();
		document.querySelector('#modal-overlay').classList.add('show');
    
    for(var i = 0; i < modalLinks.length; i++) {
      modals[i].classList.remove('show');
    }
    selectedModal.classList.add('show'); 
	};
	
	
	var modalLinks = document.querySelectorAll('.show-modal');
	
	for(var i = 0; i < modalLinks.length; i++){
		modalLinks[i].addEventListener('click', showModal);
	}
	

	var hideModal = function(event){
		event.preventDefault();
		document.querySelector('#modal-overlay').classList.remove('show');
	};
	
	var closeButtons = document.querySelectorAll('.modal .close');
	
	for(var i = 0; i < closeButtons.length; i++){
		closeButtons[i].addEventListener('click', hideModal);
	}
	
	
	document.querySelector('#modal-overlay').addEventListener('click', hideModal);
	
	
	var modals = document.querySelectorAll('.modal');
	
	for(var i = 0; i < modals.length; i++){
		modals[i].addEventListener('click', function(event){
			event.stopPropagation();
		});
	}
	
  
})();


