let vm = new Vue({
    el: "#dev-app",
    template: `<div>
        <button id="dev-start-button" v-on:click="startCountdown"> Start Countdown </button>
        <button id="dev-reset" v-on:click="resetCountdown"> Reset Countdown </button>
    </div>`,
    methods: {
        startCountdown: async function() {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "status":"start"
                    })
                }
            await fetch("/dev", requestOptions)
                .then(response => { response.json() })
        },
        resetCountdown: async function() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "status":"reset"
                })
            }
        await fetch("/dev", requestOptions)
            .then(response => { response.json() })
    }
    }
});