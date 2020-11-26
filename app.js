const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

// Home Page 
app.get("/", (req, res) => {
    res.sendFile("src/html.html", { root: __dirname });
});


// Exhibition Route
let voteCounts = {
    redCount: 0,
    blueCount: 0,
    greenCount: 0,
    whiteCount: 0,
    voteTally: function() {
        console.log(`Red:${this.redCount}| Blue:${this.blueCount}| Green:${this.greenCount}| White:${this.whiteCount}`);
    }
}

function updateColourVotes(selectedColour, previousColour) {
    // Handling of added vote
    switch(selectedColour) {
        case "Red":
            voteCounts.redCount++
            break;
        case "Blue":
            voteCounts.blueCount++
            break;
        case "Green":
            voteCounts.greenCount++
            break;
        case "White":
            voteCounts.whiteCount++
            break;
    }

    // Handling of removed vote
    switch(previousColour) {
        case "Red":
            voteCounts.redCount--
            break;
        case "Blue":
            voteCounts.blueCount--
            break;
        case "Green":
            voteCounts.greenCount--
            break;
        case "White":
            voteCounts.whiteCount--
            break;
    }
}

app.route("/exhibition")
    .get((req, res) => {
        res.sendFile("src/exhibition.html", { root: __dirname });
    })
    .post((req, res) => {
        selectedColour = req.body.selectedColour;
        previousColour = req.body.previousColour;

        console.log(`Vote Received: Selected Colour: ${selectedColour}| Previous Colour: ${previousColour}`);
        updateColourVotes(selectedColour, previousColour);
        voteCounts.voteTally();
        res.send({ "complete":"COMPLETE" });
    });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});