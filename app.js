import { createApp } from './libs/vue.js'
import test from './components/testcomponent.js'

createApp({
    components: {
        test
    },
    data() {
        return {
            loggedIn: true,
            userName: 'Brylle Olaivar'
        }
    },
    methods: {
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

                const a = msalInstance.getAllAccounts()[0];
                console.log(a.name)
                this.loggedIn = true;
            }
        },

        showSide() {
            let display = document.getElementsByClassName("side")[0].style.display;

            if(display == "none") {
                document.getElementsByClassName("side")[0].style.display = "block";
            } else {
                document.getElementsByClassName("side")[0].style.display = "none";
            }
        }
    }
}).mount('#app')