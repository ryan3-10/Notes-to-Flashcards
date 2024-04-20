const inputFile = document.getElementById("input-file");
const questionCard = document.getElementById("question");
const answerCard = document.getElementById("answer");
const cardCountSpan = document.getElementById("card-count");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const shuffleCheck = document.getElementById("shuffle-check");
const clearButton = document.getElementById("clear-button");
const clearTextButton = document.getElementById("clear-text-button");
const textBox = document.getElementById("text-box");
const addWithFileButton = document.getElementById("add-file-button");
const addWithTextButton = document.getElementById("add-text-button");
const showCardsButton = document.getElementById("show-cards-button");
const showSettingsButton = document.getElementById("to-settings");
const settingsScreen = document.getElementById("settings-screen");
const cardScreen = document.getElementById("card-screen");
const cardTotalSpan = document.getElementById("card-total");

let questions = [];
let shuffledQuestions = [];
let currentCard = 0;

showCardsButton.addEventListener("click", () => {
    settingsScreen.style.display = "none";
    cardScreen.style.display = "block";
});

showSettingsButton.addEventListener("click", () => {
    cardScreen.style.display = "none";
    settingsScreen.style.display = "block";
});

clearTextButton.addEventListener("click", () => {
    textBox.value = "";
});

shuffleCheck.addEventListener("change", e => {
    if (!questions.length) {
        return;
    }
    if (e.target.checked) {
        shuffleArray(shuffledQuestions);
    }
    currentCard = 0;
    updateCards();;
});

addWithFileButton.addEventListener("click", () => {    // Get the contents of the file
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContents = event.target.result;
        generateCards(fileContents);
    }

    reader.readAsText(inputFile.files[0])
});

addWithTextButton.addEventListener("click", () => {
    generateCards(textBox.value);
});

answerCard.addEventListener("click", e => {
    if (e.target.textContent === "") {
        return;
    }
    const currentDeck = getCurrentDeck();
    e.target.textContent = e.target.textContent === "Click to see answer"
    ? currentDeck[currentCard].answer 
    : "Click to see answer";
});

clearButton.addEventListener("click", () => {
    questions = [];
    shuffledQuestions = [];
    currentCard = 0;
    cardCountSpan.textContent = "0 of 0";
    updateCardTotal();
    updateCards();
});

previousButton.addEventListener("click", () => {
    navigate("<");
});

nextButton.addEventListener("click", () => {
    navigate(">");
});

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const getCurrentDeck = () => {
    return shuffleCheck.checked ? shuffledQuestions : questions;
}

const navigate = direction => {
    if (!questions.length) { // Make sure questions have ben generated
        return;
    }
    if (direction === "<") {
        currentCard = currentCard > 0 ? currentCard - 1 : questions.length - 1;
    } else if (direction === ">") {
        currentCard = currentCard < questions.length - 1 ? currentCard + 1 : 0;
    }
    updateCards();
}

const updateCards = () => {
    if (!questions.length) {
        questionCard.textContent = "";
        answerCard.textContent = "";
        return;
    }

    const currentDeck = getCurrentDeck();
    const question = currentDeck[currentCard].question;
    questionCard.textContent = question;
    answerCard.textContent = "Click to see answer";
    cardCountSpan.textContent = `${currentCard + 1} of ${questions.length}`;
}

const updateCardTotal = () => {
    cardTotalSpan.textContent = questions.length;
}

const generateCards = (fileContents) => {
    const lines = fileContents.split("\n");
    let question = null;
    let answer = null;
    let showWarning = false;
    let cardsToAdd = [];

    const showError = (question) => {
        if (question === null) {
            alert("Not a single quesiton was found in your text :O");
            return;
        }
        alert(`Error: could not find an answer to "${question}"`);
    }

    for (let currentLine of lines) {
        currentLine = currentLine.trim();
        if (!currentLine) { // Check for empty lines
            continue;
        }
        if (currentLine[currentLine.length - 1] === "?" && question === null) {
            question = currentLine;
        } else if (currentLine[currentLine.length - 1] != "?" && question != null) {
            answer = currentLine;
            cardsToAdd.push({question, answer});
            question = null;
        } else if (currentLine[currentLine.length - 1] === "?") {
            return showError(question);
        } else {
            showWarning = true;
        }
    }
    if (question !== null || !cardsToAdd.length) {
        return showError(question);
    }
    if (showWarning) {
        alert(
        "We found some lines in your text that don't seem to be questions and answers. We've generated cards with what we did find."
        ) 
    }

    for ({question, answer} of cardsToAdd) {
        questions.push({question, answer});
        shuffledQuestions.push({question, answer});
    }
    shuffleArray(shuffledQuestions);
    updateCardTotal();
    updateCards();
}
