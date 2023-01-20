const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const cors = require('cors');
const app = express();
//app.use(cors);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.get("/failure", function(req, res) {
    res.redirect("/");
    //req.redirect("/");
})

app.post("/", function(req,res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/b0c5202ce3"

    const options = {
        method: "POST",
        auth: "ayush:97ad5d518651836e32a0c683c1df08ad-us21"
    }

    const request = https.request(url, options, function(response) {
        if(response.statusCode===200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(3000, function () {
    console.log("Listening to port 3000....");
})

//audience id: b0c5202ce3
//api key: 97ad5d518651836e32a0c683c1df08ad-us21