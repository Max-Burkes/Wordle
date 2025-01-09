var boxes = document.getElementsByClassName("boxes");
const pos = [1, 1];
var words = ["nikki", "loves"];

const word = words[Math.floor(Math.random() * words.length)];
console.log(words);
console.log(word);
var counts = [];
var guess = [];

/**
 * Counts the occurence of letters in the word
 */
for (var i = 0; i < 5; i++) {
    if (counts.includes(word.charAt(i))) {
        counts[word.charAt(i)] += 1;
    } else {
        counts[word.charAt(i)] = 1;
    }
}


/**Adds listeners to the input fields */
for (var i = 0; i < 30; i++) {
    boxes[i].addEventListener("keypress", changeBox);
    boxes[i].addEventListener("click", unclick);
}

/** Registers which key the user presses and changes the 
 * game accordingly.
 */
function changeBox(event) {
    console.log(event.keyCode);
    if (event.keyCode >= 97 && event.keyCode <= 122) {
        
        event.preventDefault(); // Prevent the default keypress behavior

        addLetter.call(this, event.key);
    } else if (event.keyCode == 13 && pos[1] == 5) {
        checkAnswer.call(this);
    }
}

/*Changes an input box to a letter that the user typed in*/ 
function addLetter(letter) {

    guess.push(letter);

    if (this.className != "boxes last") {
        this.parentElement.innerHTML = letter;

        pos[1] += 1;
        var next = document.getElementById(pos[0] + "," + pos[1]).children[0];
        next.value = "";
        
        next.focus();
    } else {
        console.log("Hi")
        this.value = letter;
    }
}


function checkAnswer() {

    this.parentElement.innerHTML = this.value; //updates the value of the last box
    let correct = true;

    for (var i = 0; i < 5; i++) {

        if (guess[i] == word.charAt(i)) {//If the user is right, mark green
            document.getElementById(pos[0] + "," + (i + 1)).className = "right";

        } else if (word.includes(guess[i])) {//right letter wrong place, mark yellow
            document.getElementById(pos[0] + "," + (i + 1)).className = "almost-right";
            correct = false;

        } else {//wrong letter, mark grey
            document.getElementById(pos[0] + "," + (i + 1)).className = "wrong";
            correct = false;
        }
    }

    if(correct) {
        winner();

    } else {
        pos[0] += 1;
        pos[1] = 1;
        document.getElementById(pos[0] + "," + pos[1]).children[0].focus();

        guess = [];
    }

}

function winner() {
    console.log("You win");
}

/**
 * Ensures the user can only press on the box they're typing in
 */
function unclick() {
    if (this.parentElement.id != pos[0] + "," + pos[1]) {
        this.blur();
        document.getElementById(pos[0] + "," + pos[1]).children[0].focus();
    }
}