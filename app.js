const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const socket = require("socket.io");
const formStructure = require("./src/form.json")
let countdown = "";


// Voting results setup (results are to be reset per round)
// -1 is to be considered undefined, it should be updated to 0 if there is an equivalent button
let voteCounts = [
    firstCount = -1,
    secondCount = -1,
    thirdCount = -1,
    fourthCount = -1,
    fifthCount = -1
]
function restartCounts() {
    voteCounts = [-1, -1, -1, -1, -1];
    console.log(`Vote Counts Reset`);
}


// Function to convert the vote text to it's corresponding position and saved
function updateVotes(selectedVote, previousVote) {  
    // Increment and Decrement of corresponding votes
    let phaseStructure = formStructure[formPhase-1];
    let selectedIndex = phaseStructure.options.indexOf(selectedVote);
    
    console.log(voteCounts[selectedIndex])
    voteCounts[selectedIndex] ++
    if(previousVote != "") {
        let previousIndex = phaseStructure.options.indexOf(previousVote);
        voteCounts[previousIndex]--
    }
}

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

// Index Route 
app.get("/", (req, res) => {
    res.sendFile("src/html/index.html", { root: __dirname });
});

// DevView Route
app.route("/dev")
    .get((req, res) => {
        res.sendFile("src/html/dev.html", { root: __dirname })
    })
    .post((req, res) => {
        if (req.body.status == "start") {
            startCountdown();
        } else if (req.body.status == "reset") {
            clearInterval(countdown);
            formPhase = 1;
            countdownValue = 21;
            // Reset initialisation
            for(let i = 0; i < formStructure[formPhase-1].options.length; i++) {
                voteCounts[i] = 0;
            }
        }
    })

// Exhibition Route
app.route("/exhibition")
    .get((req, res) => {
        res.sendFile("src/html/exhibition.html", { root: __dirname });
    })
    .post((req, res) => {
        selectedVote = req.body.selectedVote;
        previousVote = req.body.previousVote;

        console.log(`Vote Received: Selected Vote ${selectedVote} | Previous Vote: ${previousVote}`);
        updateVotes(selectedVote, previousVote);
        res.send({ "complete":"complete" });
    });

    
// Artist Statment Route
app.route("/artist")
.get((req, res) => {
    res.sendFile("src/html/artiststatement.html", { root: __dirname });
});

// Projects and Other Works Route
app.get("/projects", (req, res) => {
    res.sendFile("src/html/projects.html", { root: __dirname });
})

// About Route
app.get("/about", (req, res) => {
    res.sendFile("src/html/about.html", { root: __dirname });
})


// Express Server Setup
let server = app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


// Countdown and Form Phase Countdown setup
let formPhase = 1;
let countdownValue = 21;

// First 'initialisation' of the vote counts for tallys where there are assigned buttons
for(let i = 0; i < formStructure[formPhase-1].options.length; i++) {
    voteCounts[i] = 0;
}

// Handling the countdown and formphase increment
function startCountdown() {
    countdown = setInterval(() => {
        countdownValue--;
        console.log(`Countdown: ${countdownValue}, Form Phase: ${formPhase}`);
        // Resets the countdown to 60s and resets the vote counts.
        if (countdownValue <= 0) {
            formPhase++;
            countdownValue = 41;
            // Resetting vote counts for 'initialisation'
            restartCounts();
            // 'Initialising' the vote counts for tallys where there are assigned buttons
            try {
                for(let i = 0; i < formStructure[formPhase-1].options.length; i++) {
                    voteCounts[i] = 0;
                }
            } catch (TypeError) {
                console.log("Type Error - Form Structure complete");
                clearInterval(countdown)
            }
        }
    }, 1000);
}

// Socket setup
let io = socket(server);
io.on("connection", socket => {
    console.log(`Socket connection made ${socket.id}`);

    // Sending countdown and current phase formstructure to client.
    setInterval(() => {
        socket.emit("countdown", countdownValue);
        socket.emit("form-send", formStructure[formPhase-1]);
        socket.emit("voteCounts", voteCounts);
    }, 1000);
});