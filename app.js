import { createApp } from './libs/vue.js'
import test from './components/testcomponent.js'

createApp({
    components: {
        test
    },
    data() {
        return {
            titleClass: 'titlesssas',
            userName: ''
        }
    },
    methods: {
        async login() {
            const msalConfig = {
                auth: {
                    clientId: "ce4556ff-00c1-45ce-80e1-7ae069267435",
                    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
                    redirectUri: `http://localhost:8080/lista-qr`,
                }
            };

            const msalInstance = new msal.PublicClientApplication(msalConfig);
            if (msalInstance.getAllAccounts()) {
                await msalInstance.loginPopup();

                const a = msalInstance.getAllAccounts()[0];
                console.log(a.name)
            }
        }
    }
}).mount('#app')