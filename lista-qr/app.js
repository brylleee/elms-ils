Vue.createApp({
    mounted() {
        const msalConfig = {
            auth: {
                clientId: "ce4556ff-00c1-45ce-80e1-7ae069267435",
                authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
                redirectUri: `http://localhost:5500/lista-qr`,
            }
        };

        const msalInstance = new msal.PublicClientApplication(msalConfig);

        msalInstance.handleRedirectPromise();
    }
}).mount('#app');