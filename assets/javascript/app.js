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
    },

    showNextQuestion: function () {
        $("#question-choices").show();
        if (this.infoObjects.length > 0) {
            console.log("Test: " + this.infoObjects[0]);
            this.updateWithInfo(this.infoObjects.shift());
            this.timer = setInterval(this.countdown, 1000);
        } else {
            // TODO: Show the end of game screen and add a reset button
        }
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

    newGame: function () {
        this.infoObjects = [];
        var shuffledInfoObjects = shuffle(this.allInfoObjects);
        console.log("Test1: " + shuffledInfoObjects.length);
        for (var i = 0; i < 5; i++) {
            // Add the first 5 shuffled info objects to `infoObjects`
            this.infoObjects.push(shuffledInfoObjects[i]);
        }

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
            } else {
                $("#result").html("<b>" + clickedText + "</b> is <b>wrong!</b>");
            }
        });
    },

};

window.onload = function (event) {
    console.log("window.onload");
    game.newGame()
    $("#question-choices").hide();
    $("#question-image").hide();
    $("#start-game").on("click", function (event) {
        $(this).hide();
        game.showNextQuestion()
    });
}