require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

//we use this line to sure that .env variables is work
//console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//DeprecationWarning solved
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
}

//Mongoose Schema
const userSchema = new mongoose.Schema ({
    emial: String,
    password: String
});

//Mongoose Model(collection)
const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register", function(req, res){
    const newUser = new User({
        emial: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function(error){
        if (error) {
            console.log(error);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password)

    User.findOne({emial: username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }     
        }
    });
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });