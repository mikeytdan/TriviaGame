// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var game = {

    infoObjects: [],
    timer: null,
    displayedInfo: null,
    maxSeconds: 30,
    seconds: this.maxSeconds,
    correct: 0,
    incorrect: 0,

    allInfoObjects: [
        {
            question: "What is the answer to life, the universe and everything?",
            answer: "42",
            answerImage: "https://media.giphy.com/media/BVlWY2vMZgLG8/giphy.gif",
            fakeAnswers: ["24", "13", "31"]
        },
        {
            question: "How many electrons does an Oxygen atom have?",
            answer: "8",
            answerImage: "https://media.giphy.com/media/lVbcNXfGBkG6Q/giphy.gif",
            fakeAnswers: ["6", "9", "12"]
        },
        {
            question: "What is Dihydrogen Monoxide",
            answer: "Water",
            answerImage: "https://media3.giphy.com/media/JXHhI4o9NCf8k/giphy.gif",
            fakeAnswers: ["Cleaning Chemical", "Band", "Blimp"]
        },
        {
            question: "How far is the Moon from the Earth?",
            answer: "238,900 mi",
            answerImage: "https://media.giphy.com/media/aN9GqoR7OD3nq/giphy.gif",
            fakeAnswers: ["238,90 mi", "2,389,000 mi", "2,389 mi"]
        },
        {
            question: "Which animal was introduced to Australia in 1859?",
            answer: "Rabbits",
            answerImage: "https://media.giphy.com/media/WiXMlla4ZFR8Q/giphy.gif",
            fakeAnswers: ["Marsupial", "Dingo", "Kangaroo"]
        },
        {
            question: "When was the United States founded?",
            answer: "July 4, 1776",
            answerImage: "https://media.giphy.com/media/sFMDqop2ku4M0/giphy.gif",
            fakeAnswers: ["July 4, 1492", "July 4, 1912", "July 4, 1812"]
        },
        {
            question: "What color is a smurf?",
            answer: "Blue",
            answerImage: "https://media.giphy.com/media/AxVvjLgE0EzJ4cF5C0/giphy.gif",
            fakeAnswers: ["Purple", "Red", "Multicolor"]
        }
    ],

    clearTimer: function () {
        this.seconds = this.maxSeconds;
        $("#seconds").text(this.seconds);
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    },

    countdown: function () {
        game.seconds--;
        $("#seconds").text(game.seconds);
        if (game.seconds <= 0) {
            game.selectedAnswer(null);
        }
    },

    showNextQuestion: function () {
        $("#question-image").hide();
        if (this.infoObjects.length > 0) {
            $("#countdown").show();
            $("#question-choices").show();
            this.updateWithInfo(this.infoObjects.shift());
            this.timer = setInterval(this.countdown, 1000);
        } else {
            this.showEndGame()
        }
    },

    showEndGame: function () {
        $("#end-game").show();
        $("#correct").text(this.correct);
        $("#incorrect").text(this.incorrect);
    },

    infoObject: function (question, answer, answerImage, fakeAnswers) {
        return {
            question: question,
            answer: answer,
            answerImage: answerImage,
            fakeAnswers: fakeAnswers
        }
    },

    updateWithInfo: function (infoObject) {
        $("#question-choices").show();
        $("#question-image").hide();
        this.displayedInfo = infoObject;
        $("#question").text("\"" + infoObject.question + "\"");
        var answers = infoObject.fakeAnswers.slice(); // Copy the fake answers array
        answers.push(infoObject.answer);
        answers = shuffle(answers);
        for (var i = 0; i < answers.length; i++) {
            $("#answer-" + (i + 1)).text(answers[i]);
        }
        $("#answer-image")[0].src = infoObject.answerImage;
    },

    newGame: function () {
        this.seconds = this.maxSeconds;
        this.correct = 0;
        this.incorrect = 0;
        this.infoObjects = [];
        var shuffledInfoObjects = shuffle(this.allInfoObjects);
        var count = this.allInfoObjects.length > 5 ? 5 : this.allInfoObjects.length;
        for (var i = 0; i < count; i++) {
            // Add the first 5 shuffled info objects to `infoObjects`
            this.infoObjects.push(shuffledInfoObjects[i]);
        }
    },

    selectedAnswer: function (answer) {
        this.clearTimer();
        $("#countdown").hide();
        $("#question-choices").hide();
        $("#question-image").show();
        if (answer != null && answer == this.displayedInfo.answer) {
            $("#result").html("<b>" + answer + "</b> is<br><h2>Correct!</font></h2>");
            this.correct++;
        } else {
            if (answer == null) {
                $("#result").html("<b>You ran out of time!</b>");
            } else {
                $("#result").html("<b>" + answer + "</b> is<br><h2>Wrong!</h2>");
            }
            this.incorrect++;
        }
        $("#answer-text").html("The correct answer is: <b>" + this.displayedInfo.answer + "</b>");
        setTimeout(function () {
            $("#result").html("");
            $("#answer-text").text("");
            this.showNextQuestion();
        }.bind(this), 3000);
    },

    setup: function () {
        var self = this;
        $(".answer").on("click", function (event) {
            var clickedText = $(this).text();
            self.selectedAnswer(clickedText);
        });
    }

};

window.onload = function (event) {
    game.setup();
    $("#end-game").hide();
    $("#countdown").hide();
    $("#question-choices").hide();
    $("#question-image").hide();
    $("#start-game").on("click", function (event) {
        $(this).hide();
        game.newGame();
        game.showNextQuestion()
    });
    $("#end-game").on("click", function (event) {
        $(this).hide();
        $("#start-game").show();
    });
}