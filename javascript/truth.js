// Prevent forms from refreshing the page.
document.getElementById("name-form").addEventListener("submit", function (event) {
    event.preventDefault();
    greet();
});

document.getElementById("trivia-form").addEventListener("submit", function (event) {
    event.preventDefault();
    trivia1();
});

document.getElementById("lie-form").addEventListener("submit", function (event) {
    event.preventDefault();
    submitGame("lie");
});

document.getElementById("truth-form").addEventListener("submit", function (event) {
    event.preventDefault();
    submitGame("truth");
});

function greet() {
    let greetParagraph = document.getElementById("greet");

    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let age = document.getElementById("age").value;

    greetParagraph.textContent = "Greetings " + age + " year old "
        + fname + " " + lname + "!";
}

// Apply the green or red background and replay the animation.
function showFeedback(formId, correct) {
    let form = document.getElementById(formId);

    form.classList.remove("correct", "incorrect");

    // Restart the animation, even if the result is the same.
    void form.offsetWidth;

    if (correct) {
        form.classList.add("correct");
    }
    else {
        form.classList.add("incorrect");
    }
}

function trivia1() {
    let answer = document.getElementById("trivia1-answer");

    let chocolateSelected = document.getElementById("chocolate").checked;
    let tunaSelected = document.getElementById("tuna").checked;
    let honeySelected = document.getElementById("honey").checked;

    if (honeySelected) {
        answer.textContent = "Correct! The answer is honey!";
        showFeedback("trivia-form", true);
    }
    else if (chocolateSelected || tunaSelected) {
        answer.textContent = "Incorrect! The answer is honey.";
        showFeedback("trivia-form", false);
    }
    else {
        answer.textContent = "Please select an answer!";
    }
}

function checkLie() {
    let answer = document.getElementById("lie-answer");

    let firstSelected = document.getElementById("statement1").checked;
    let secondSelected = document.getElementById("statement2").checked;
    let thirdSelected = document.getElementById("statement3").checked;

    if (thirdSelected) {
        answer.textContent = "Correct! An hour has sixty minutes.";
        showFeedback("lie-form", true);
    }
    else if (firstSelected || secondSelected) {
        answer.textContent = "Incorrect! That statement is true.";
        showFeedback("lie-form", false);
    }
    else {
        answer.textContent = "No answer selected! The third statement is the lie.";
        showFeedback("lie-form", false);
    }
}

function checkTruths() {
    let answer = document.getElementById("truth-answer");

    let firstSelected = document.getElementById("truth1").checked;
    let secondSelected = document.getElementById("truth2").checked;
    let thirdSelected = document.getElementById("truth3").checked;

    if (firstSelected && secondSelected && !thirdSelected) {
        answer.textContent = "Correct! You selected both truths!";
        showFeedback("truth-form", true);
    }
    else if (firstSelected || secondSelected || thirdSelected) {
        answer.textContent = "Incorrect! Only the first two statements are true.";
        showFeedback("truth-form", false);
    }
    else {
        answer.textContent = "No answers selected! The first two statements are true.";
        showFeedback("truth-form", false);
    }
}

// Each game has its own timer and deadline.
let timers = {};

let deadlines = {};

let gameRunning = {
    lie: false,
    truth: false
};

function startGame(game) {
    if (gameRunning[game]) {
        return;
    }

    let form = document.getElementById(game + "-form");

    gameRunning[game] = true;
    deadlines[game] = Date.now() + 20000;

    form.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });

    document.getElementById(game + "-start").disabled = true;
    document.getElementById(game + "-submit").disabled = false;

    updateTimer(game);

    timers[game] = setInterval(function () {
        updateTimer(game);
    }, 250);
}

function updateTimer(game) {
    let timeLeft = Math.max(
        0,
        Math.ceil((deadlines[game] - Date.now()) / 1000)
    );

    document.getElementById(game + "-timer").textContent =
        "Time left: " + timeLeft + " seconds";

    if (timeLeft === 0) {
        submitGame(game);
    }
}

function submitGame(game) {
    if (!gameRunning[game]) {
        return;
    }

    let timeExpired = Date.now() >= deadlines[game];

    clearInterval(timers[game]);
    gameRunning[game] = false;

    if (game === "lie") {
        checkLie();
    }
    else {
        checkTruths();
    }

    // Lock the choices after submitting.
    document.getElementById(game + "-form")
        .querySelectorAll("input")
        .forEach(function (input) {
            input.disabled = true;
        });

    document.getElementById(game + "-submit").disabled = true;

    if (timeExpired) {
        document.getElementById(game + "-timer").textContent =
            "Time's up! Your answer is locked.";
    }
    else {
        document.getElementById(game + "-timer").textContent =
            "Answer submitted and locked!";
    }
}