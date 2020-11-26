let selectedColour = "";

// Creates a POST request sending the selectedColour and the previously selected colour
// allowing the votes to be updated.
async function updateVoteRequest(selectedColour, previousColour) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "selectedColour": selectedColour,
                "previousColour": previousColour })
    };
    await fetch("/exhibition", requestOptions)
        .then(response => { response.json() })
}

Vue.component("colour-button", {
    props: ["title", "voteCount"],
    methods: { colourVote: function(event) {
        previousColour = selectedColour.trim();
        selectedColour = event.srcElement.innerHTML.trim();
        if (previousColour != selectedColour) {
            updateVoteRequest(selectedColour, previousColour);
        }
        console.log(selectedColour, previousColour);
        }
    },
    template: `<button id="colour-button" v-on:click="colourVote"> {{ title }} </button>
    `
})

new Vue({
    el: "#colour-vote",
})


//event > srcelement > innerhtml

// Fetch with Axios https://jasonwatmore.com/post/2020/04/30/vue-fetch-http-post-request-examples
// Express routing https://expressjs.com/en/guide/routing.html 