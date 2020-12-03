let vm = new Vue({
    el: "#dev-app",
    template: `<div>
        <button id="dev-start-button" v-on:click="startCountdown" style="display: Block; width: 400px; height: 150px"> Start Countdown </button>
        <button id="dev-reset" v-on:click="resetCountdown" style="margin-top: 200px"> Reset Countdown </button>
    </div>`,
    methods: {
        startCountdown: async function() {
            // Hide start countdown button once pressed to prevent multiple clicks
                button = document.getElementById("dev-start-button");
                button.style.display = "none";

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
            // Unhide start countdown button once pressed to allow restarting of countdown
            button = document.getElementById("dev-start-button");
            button.style.display = "block";

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