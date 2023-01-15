Vue.createApp({
    watch: {
        loggedIn(val) {
            if(val) {
                // Notice after logging in
                setTimeout(() => {
                    $('#notice').modal('show');
                }, 500);

                document.getElementById("score-math").style.width = `0%`;
                document.getElementById("score-science").style.width = `0%`;
                document.getElementById("score-history").style.width = `0%`;
                document.getElementById("score-computer").style.width = `0%`;
                document.getElementById("score-overall").style.width = `0%`;

                this.startTimer();
            }
        }
    },
    mounted() {
        $('#end-notice').modal('show');
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
            max: 20,
            score: 0,
            math: 0,
            science: 0,
            history: 0,
            computer: 0,
            choice: "",
            choices: [0, 0, 0, 0],
            currentIndex: 0,
            minutes: 30,
            statusColor: "red",
            highscorer: "Loading...",
            highscore: "Loading...",
            db: KVdb.bucket('5M8Lj224RJKVytT2N7axJp').localStorage()
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

        async nextQuestion() {
            // Check if correct score then increase it if true
            if(this.decodeb64(this.choice) == this.decodeb64(this.questions[this.currentIndex].correct_answer)) {
                this.score++;

                if(this.decodeb64(this.category) == "Science: Mathematics") {
                    this.math++;
                } else if(this.decodeb64(this.category) == "Science & Nature") {
                    this.science++;
                } else if(this.decodeb64(this.category) == "History") {
                    this.history++;
                } else if(this.decodeb64(this.category) == "Science: Computers") {
                    this.computer++;
                }
            }

            // Increase progress bar
            document.getElementById("progress").style.width = `${this.currentIndex * 5}%`;

            // Reset choices
            try {
                document.querySelector('input[name="flexRadioDefault"]:checked').checked = false;
            } catch(e) {
                // ...
            }

            if(this.currentIndex >= this.max - 1) {
                // Display congratulations modal with statistics
                // Also display leaderboard
                // Should be on a function
                if(this.score >= 15) {
                    this.statusColor = "green";
                }

                document.getElementById("score-math").style.width = `${this.math * 5}%`;
                document.getElementById("score-science").style.width = `${this.science * 5}%`;
                document.getElementById("score-history").style.width = `${this.history * 5}%`;
                document.getElementById("score-computer").style.width = `${this.computer * 5}%`;
                document.getElementById("score-overall").style.width = `${this.score * 5}%`;

                let highscorer = await this.db.getItem("highscorer").then(who => who);
                let highscore = await this.db.getItem("highscore").then(score => score);

                if(this.score > highscore) {
                    this.highscorer = this.userName;
                    this.highscore = this.score;
                } else {
                    this.highscorer = highscorer;
                    this.highscore = highscore;
                }

                $('#end-notice').modal('show');
            } else {
                // Move on to next question and shuffle choices
                this.currentIndex++;
                this.category = this.questions[this.currentIndex].category
                this.question = this.questions[this.currentIndex].question;
                this.mixChoices();
            }
        },

        // Mix and randomize choices
        mixChoices() {
            this.choices = this.questions[this.currentIndex].incorrect_answers;
            this.choices.push(this.questions[this.currentIndex].correct_answer);
            this.choices = this.shuffle(this.choices);
        },

        decodeb64(s) {
            var e = {},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
            var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(i=0;i<64;i++){e[A.charAt(i)]=i;}
            for(x=0;x<L;x++){
                c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
            }
            return r;
        },

        logout() {
            // Put modal alert here maybe
            this.loggedIn = false;
            this.score = 0;
            this.math = 0;
            this.science = 0;
            this.history = 0;
            this.computer = 0;
            this.currentIndex = 0;
            this.minutes = 30;
        },

        startTimer: function () {
            setInterval(() => {
                 this.minutes--;

                 if(this.minutes == -1 && isTimed) {
                    // Times up
                 }
            }, 60000);
        },

        async start() {
            let computerStudies = await fetch(`https://opentdb.com/api.php?amount=25&category=18&type=multiple&difficulty=${this.difficulty}&encode=base64`).then(response => response.json()).then(result => result['results']);
            let science = await fetch(`https://opentdb.com/api.php?amount=25&category=17&type=multiple&difficulty=${this.difficulty}&encode=base64`).then(response => response.json()).then(result => result['results']);
            let history = await fetch(`https://opentdb.com/api.php?amount=25&category=23&type=multiple&difficulty=${this.difficulty}&encode=base64`).then(response => response.json()).then(result => result['results']);
            let math = await fetch(`https://opentdb.com/api.php?amount=25&category=19&type=multiple&encode=base64`).then(response => response.json()).then(result => result['results']);

            // Initiate questions and first question
            this.questions = this.shuffle(computerStudies.concat(science).concat(history).concat(math)).slice(0, 20);
            this.category = this.questions[this.currentIndex].category;
            this.question = this.questions[this.currentIndex].question;
            this.mixChoices();
        }
    }
}).mount('#app')