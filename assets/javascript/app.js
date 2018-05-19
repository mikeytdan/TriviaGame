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
    seconds: 30,
    correct: 0,
    incorrect: 0,

    allInfoObjects: [
        {
            question: "What is the answer to life?",
            answer: "42",
            answerImage: "https://media.giphy.com/media/BVlWY2vMZgLG8/giphy.gif",
            fakeAnswers: ["24", "13", "31"]
        },
        {
            question: "What is not the answer to life?",
            answer: "24",
            answerImage: "https://media.giphy.com/media/BVlWY2vMZgLG8/giphy.gif",
            fakeAnswers: ["42", "42", "42"]
        }
    ],

    clearTimer: function () {
        this.seconds = 30;
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

        }
    },

    showNextQuestion: function () {
        $("#question-image").hide();
        if (this.infoObjects.length > 0) {
            $("#question-choices").show();
            console.log("Test: " + this.infoObjects[0]);
            this.updateWithInfo(this.infoObjects.shift());
            this.timer = setInterval(this.countdown, 1000);
        } else {
            this.showEndGame()
            // TODO: Show the end of game screen and add a reset button
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
        console.log(this.displayedInfo);
        $("#question").text(infoObject.question);
        var answers = infoObject.fakeAnswers.slice(); // Copy the fake answers array
        answers.push(infoObject.answer);
        answers = shuffle(answers);
        for (var i = 0; i < answers.length; i++) {
            $("#answer-" + (i + 1)).text(answers[i]);
        }
        $("#answer-text").text("The correct answer is: " + infoObject.answer);
        $("#answer-image")[0].src = infoObject.answerImage;
        console.log(this.displayedInfo);
    },

    showQuestionImage: function() {
        // TODO: Move part of the setup logic here
    },

    newGame: function () {
        this.correct = 0;
        this.incorrect = 0;
        this.infoObjects = [];
        var shuffledInfoObjects = shuffle(this.allInfoObjects);
        console.log("Test1: " + shuffledInfoObjects.length);
        var count = this.allInfoObjects.length > 5 ? 5 : this.allInfoObjects.length;
        for (var i = 0; i < count; i++) {
            // Add the first 5 shuffled info objects to `infoObjects`
            this.infoObjects.push(shuffledInfoObjects[i]);
        }
    },

    setup: function() {
        var self = this;
        $(".answer").on("click", function (event) {
            $("#question-choices").hide();
            $("#question-image").show();
            self.clearTimer();
            setTimeout(function () {
                self.showNextQuestion();
            }.bind(self), 1000);
            console.log(event);
            var clickedText = $(this).text();
            if (clickedText == self.displayedInfo.answer) {
                $("#result").html("<b>" + clickedText + "</b> is <b>correct!</b>");
                self.correct++;
            } else {
                $("#result").html("<b>" + clickedText + "</b> is <b>wrong!</b>");
                self.incorrect++;
            }
        });
    }

};

window.onload = function (event) {
    console.log("window.onload");
    game.setup();
    $("#end-game").hide();
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