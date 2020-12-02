let vm = new Vue({
    el: "#dev-app",
    template: `<div>
        <button id="dev-start-button" v-on:click="startCountdown" style="padding-left: 100"> Start Countdown </button>
    </div>`,
    methods: {
        startCountdown: async function() {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        "start":"start"
                    })
                }
            await fetch("/dev", requestOptions)
                .then(response => { response.json() })
        }
    }
});