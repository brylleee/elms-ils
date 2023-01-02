import { createApp } from './libs/vue.js';

/*
- Fix API questions having HTML encodings
- Statistics/Leaderboard modal (with optional times up title)
*/

createApp({
    watch: {
        loggedIn(val) {
            if(val) {
                // Notice after logging in
                setTimeout(() => {
                    $('#notice').modal('show');
                }, 500);

                this.startTimer()
            }
        }
    },
    data() {
        return {
            loggedIn: false,
            userName: '',
            difficulty: 'medium',  // For API request
            isTimed: false,
            questions: [],
            question: "",
            category: "",
            score: 0,
            choice: "",
            choices: [0, 0, 0, 0],
            currentIndex: 0,
            minutes: 30
        }
    },
    methods: {
        // Log in system
        async login() {
            const msalConfig = {
                auth: {
                    clientId: "ce4556ff-00c1-45ce-80e1-7ae069267435",
                    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
                    redirectUri: `http://localhost:5500/lista-qr`,
                }
            };

            const msalInstance = new msal.PublicClientApplication(msalConfig);

            if (msalInstance.getAllAccounts()) {
                await msalInstance.loginPopup();

                document.title = "Instructions - Assessment Exams";

                const account = msalInstance.getAllAccounts()[0];
                this.userName = account.name;
                this.loggedIn = true;
            }
        },

        // Show side bar on click when mobile view
        showSide() {
            let display = document.getElementsByClassName("side")[0].style.display;

            if(display == "none") {
                document.getElementsByClassName("side")[0].style.display = "block";
            } else {
                document.getElementsByClassName("side")[0].style.display = "none";
            }
        },

        // Shuffle array and return it
        shuffle(arr) {
            return [...arr].map((_, i, arrCopy) => {
                var rand = i + ( Math.floor( Math.random() * (arrCopy.length - i) ) );
                [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]]
                return arrCopy[i]
            })
        },

        nextQuestion() {
            // Check if correct score then increase it if true
            if(this.choice == this.questions[this.currentIndex].correct_answer) {
                this.score++;
            }

            // Increase progress bar
            document.getElementById("progress").style.width = `${this.currentIndex}%`;

            if(this.currentIndex == 99) {
                // Display congratulations modal with statistics
                // Also display leaderboard
                // Should be on a function
            }

            // Move on to next question and shuffle choices
            this.currentIndex++;
            this.category = this.questions[this.currentIndex].category
            this.question = this.questions[this.currentIndex].question;
            this.mixChoices();
        },

        // Mix and randomize choices
        mixChoices() {
            this.choices = this.questions[this.currentIndex].incorrect_answers;
            this.choices.push(this.questions[this.currentIndex].correct_answer);
            this.choices = this.shuffle(this.choices);
        },

        logout() {
            // Put modal alert here maybe
            this.loggedIn = false;
        },

        startTimer: function () {
            setInterval(() => {
                 this.minutes--;

                 if(this.minutes == -1) {
                    // Times up
                 }
            }, 60000);
        },

        async start() {
            let computerStudies = await fetch(`https://opentdb.com/api.php?amount=25&category=18&type=multiple&difficulty=${this.difficulty}`).then(response => response.json()).then(result => result['results']);
            let science = await fetch(`https://opentdb.com/api.php?amount=25&category=17&type=multiple&difficulty=${this.difficulty}`).then(response => response.json()).then(result => result['results']);
            let history = await fetch(`https://opentdb.com/api.php?amount=25&category=23&type=multiple&difficulty=${this.difficulty}`).then(response => response.json()).then(result => result['results']);
            let math = await fetch(`https://opentdb.com/api.php?amount=25&category=19&type=multiple`).then(response => response.json()).then(result => result['results']);

            // Initiate questions and first question
            this.questions = this.shuffle(computerStudies.concat(science).concat(history).concat(math));
            this.category = this.questions[this.currentIndex].category;
            this.question = this.questions[this.currentIndex].question;
            this.mixChoices();
        }
    }
}).mount('#app')