let countdownValue = "";
let formStructure = "";
let formKeyword = "";
let formOptions = "";
let voteCounts = "";
let selectedVote = "";

// Create a POST request sending the selectedVote and the previously selected Vote
// allowing the votes to be updated.
async function updateVoteRequest(selectedVote, previousVote) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            "selectedVote": selectedVote,
            "previousVote": previousVote
        })
    };
    

    await fetch("/exhibition", requestOptions)
        .then(response => { response.json() })
};

// Vue attaching instance
let vm = new Vue({
    el: "#vote-form-div",
    data() {
        return {
            formKeyword: formKeyword,
            formOptions: formOptions,
            countdownValue: countdownValue,
            voteCounts: voteCounts
        }
    },
    template:
    `<div id="exhibition-form" v-if="countdownValue<=20">
        <h2 id="countdown"> {{ countdownValue }} </h2>
        <h1 id="form-keyword"> {{ formKeyword }} </h1>
        <table id="form-table" style="width:100%;"> 
            <tr>
            <th colspan="2">
                <div id="form-options"> 
                    <button v-for="option in formOptions" class="form-option-button" v-on:click="registerVote"> {{ option }} </button>
                </div>
            </th>
            <th>
                <div id="form-vote-counts" style="text-align: left;">
                    <h3 class="vote-count" v-for="voteCount in voteCounts" v-if="voteCount != -1"> {{ voteCount }} </h3>    
                </div>
            </th>
            </tr>
        </table>
    </div>
        
    </div>`,
    methods: {
        registerVote: function(event) {
            console.log(event);
            previousVote = selectedVote.trim();
            selectedVote = event.srcElement.innerHTML.trim();
            if (previousVote != selectedVote) {
                updateVoteRequest(selectedVote, previousVote);
            }
            console.log(selectedVote, previousVote);
        }
    }
});


// Socket and Form Handling
// Making a socket connection
let socket = io();
// Receiving the form structure (every second 1s)
socket.on("form-send", data => {
    formStructure = data;    
    console.log(formStructure);
});
// Receiving and updating the countdown (every 1s)
socket.on("countdown", data => {
    vm.countdownValue = data;
    console.log(countdownValue);
});
// Receiving and updating the vote counts (every 1s)
socket.on("voteCounts", data => {
    vm.voteCounts = data;
});

// Updating the form Vue attributes (every 0.5s)
setInterval(() => {
    vm.formKeyword = formStructure.keyword;
    vm.formOptions = formStructure.options;
}, 500);
