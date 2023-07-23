const MIN = 1;
const MAX = 1000;
const FIRST_PLACE = 1;
const LAST_PLACE = 20;

const new_number_list = [];
let used_number_list = [0];

let id;
let isGeneratorValid = true;
let new_number = 0;
let score = 0;
let element;
let bestPlaceElement;
let checkbox;
let bestMove;
let bestPlace;
let AutoGenerate;
let played_games = 0;
let auto = false;
let counter = 0;
let counter1 = 0;
let scoreList = [];

// Eventhandler voor het klikken op het "generate" element
function generate() {
  // Controleer of het gegenereerde nummer al gebruikt is
  if (used_number_list.includes(new_number)) {
    isGeneratorValid = true;
  } else {
    isGeneratorValid = false;
  }

  // Blijf genereren zolang de gegenereerde waarde ongeldig is
  while (isGeneratorValid) {
    new_number = Math.floor(Math.random() * (MAX - MIN)) + MIN;

    // Controleer of de gegenereerde waarde al in de lijst staat
    if (!new_number_list.includes(new_number)) {
      document.getElementById("generated_number").innerHTML = new_number;
      new_number_list.push(new_number);


      // Bereken de beste plaats voor het gegenereerde nummer
      bestPlace = Math.round(new_number / (MAX / LAST_PLACE));
      if (bestPlace === FIRST_PLACE - 1) {
        bestPlace++;
      }

      let idBestPlace = "number" + bestPlace;
      let element = document.getElementById(idBestPlace);
      let ifBestPlaceFilled = element.classList.contains("filled");

      if (ifBestPlaceFilled) {
        let filledBy = Number(element.value);
        // Bepaal de optimale plaats voor het gegenereerde nummer
        if (filledBy > new_number) {
          while (ifBestPlaceFilled && bestPlace > FIRST_PLACE) {
            bestPlace -= 1;
            idBestPlace = "number" + bestPlace;
            element = document.getElementById(idBestPlace);
            ifBestPlaceFilled = element.classList.contains("filled");
          }
        } else if (filledBy < new_number) {
          while (ifBestPlaceFilled && bestPlace < LAST_PLACE) {
            bestPlace++;
            idBestPlace = "number" + bestPlace;
            element = document.getElementById(idBestPlace);
            ifBestPlaceFilled = element.classList.contains("filled");
          }
        }
        let isTestNumberValid = changeValue(bestPlace, true);
        
        if (isTestNumberValid === false) {
          //verloren
          bestPlace = 0;
          idBestPlace = 0;
        }
      }
      // Haal de checkbox op voor de beste zet
      let checkbox = document.getElementById("best_move");
      let bestMove = checkbox.checked;
      if (bestMove && bestPlace != 0){

        bestPlaceElement = document.getElementById(idBestPlace);
        console.log(idBestPlace);
        bestPlaceElement.style.boxShadow = "inset 4px 4px 12px rgba(20, 30, 130, 3)";
      }

      isGeneratorValid = false;
    }
  }

  isGeneratorValid = true;
}


document.addEventListener('keydown', function(event) {
  if (event.key === 'g'){
    generate();
  }
});



function restart() {
  for (let i = 1; i <= 20;i++) {
    id = "number" + i;
    element = document.getElementById(id);
    element.value = null;
    element.classList.remove("filled");
    element.style.boxShadow = "inset 4px 4px 8px rgba(81, 86, 94, 2)";
  }
  used_number_list = [0]

  played_games++;

  scoreList.push(score);
  if (played_games%5 === 0){
    console.log(scoreList);
  }
  score = 0;
  updateScore();

  new_number = 0;
  element = document.getElementById("generated_number");
  element.innerHTML = 0;

  checkbox = document.getElementById("autogenerate");
  AutoGenerate = checkbox.checked;
  if (AutoGenerate){
    generate()
  }  
} 

document.addEventListener('keydown', function(event) {
  if (event.key === 'r'){
    restart();
  }
});

function updateScore(){
  score_display = document.getElementById("score")
  score_display.value = score;

  highscore_display = document.getElementById("high_score")
  current_highscore = highscore_display.value;
  if (score > current_highscore){
    highscore_display.value = score;
  }
}



function changeValue(place, test) {
    id = "number" + place;
    let generated_number = document.getElementById('generated_number').innerHTML;
    let number = Number(generated_number);
    let isNumberValid = false;
    element = document.getElementById(id);
    let isFilled = element.classList.contains("filled");
    let prevValue = 0;
    let nextValue = 0;


    if (!(place === FIRST_PLACE)){
        let prevPlace = place - 1;
        let prevId = "number" + prevPlace;
        let prevElement = document.getElementById(prevId);
        prevValue = Number(prevElement.value);

        if (prevPlace != FIRST_PLACE + 1 ){
          while (prevValue === 0 && prevPlace > FIRST_PLACE){
            prevPlace -= 1;
            prevId = "number" + prevPlace;
            prevElement = document.getElementById(prevId);
            prevValue = Number(prevElement.value);
          }
        }
    }
        
    if (!(place === LAST_PLACE)){
        let nextPlace = place + 1;
        let nextId = "number" + nextPlace;
        let nextElement = document.getElementById(nextId);
        nextValue = Number(nextElement.value);

        if (nextPlace != LAST_PLACE - 1 ){
          while (nextValue === 0 && nextPlace < LAST_PLACE){
            nextPlace++;
            nextId = "number" + nextPlace;
            nextElement = document.getElementById(nextId);
            nextValue = Number(nextElement.value);
          }
        }
    }

    // Controleer of de waarde van het getal niet de positie tegenspreekt ten opzichte van andere getallen
    if (prevValue != 0 && nextValue != 0){
        if (number > prevValue && number < nextValue){
            isNumberValid = true;
        }
    } else if (prevValue === 0 && nextValue === 0) {
        isNumberValid = true;
    } else if (prevValue === 0 && number < nextValue){
        isNumberValid = true;
    } else if (number > prevValue && nextValue === 0){
        isNumberValid = true;
    }
    // Controleer of het veld al gevuld is, het gegenereerde nummer nul is of al gebruikt is
    if (isFilled || number === 0 || used_number_list.includes(number) || isNumberValid === false) {
      return false;
    } else {
        if (test === false){
          element.value = number;
          used_number_list.push(number);
          element.classList.add("filled");
          score++;
          updateScore();
          checkbox = document.getElementById("best_move");
          bestMove = checkbox.checked;
          if (bestMove){
            bestPlaceElement.style.boxShadow = "inset 4px 4px 8px rgba(81, 86, 94, 2)";
          }
          checkbox = document.getElementById("autogenerate");
          AutoGenerate = checkbox.checked;
          if (AutoGenerate){
            generate();
          }  
        } else if (test){
          return true;
        }
      }
}


document.addEventListener('keydown', function(event) {
  if (event.key === 'a'){
    checkbox = document.getElementById("autogenerate");
    checkbox.checked = !(checkbox.checked);
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'b'){
    checkbox = document.getElementById("best_move");
    checkbox.checked = !(checkbox.checked);
  }
});

document.addEventListener('keydown', function(event) {
  checkbox = document.getElementById("best_move");
  bestMove = checkbox.checked;
  if (event.key === 'e' && bestMove === true){
    if (bestPlace === 0){
      restart();
    } else {
    changeValue(bestPlace, false);
    }
  }
});

async function autofill(){
  checkbox = document.getElementById("autogenerate");
  checkbox.checked = true;

  if (new_number === 0){
    generate();
  }

  while (auto){
    counter++;
    if (bestPlace === 0){
      restart();
    } else {
    changeValue(bestPlace, false);
    }
    await new Promise(resolve => setTimeout(resolve,200));
    /*
    if(counter === 50){
      await new Promise(resolve => setTimeout(resolve, 5000));
      counter = 0;
      counter1++;
    }
    if (counter1 === 6){
      await new Promise(resolve => setTimeout(resolve, 30000));
      counter1 = 0;
    }
    */
  }
}



document.addEventListener('keydown', function(event) {
  if (event.key === 'p'){
    if(auto === false){
      auto = true;
      autofill(auto);
    } else{
      auto = false;
    }
  }
});