const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const {cookie} = require("express/lib/response");

app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "123566778433abcde",
    cookie: {exp: 60000},
    resave: false,
    saveUninitialized: true
}));

const myusername = 'user1'
const mypassword = 'mypassword'

 
app.get("/", (req,res) => {
    session = req.session;
    if(session.userID){
        res.send(`Hello <a href=\'/logout'> click to logout </a>`);
    } else {
        res.send("views/index.html", {root: "views"});
    } 
})

app.post("/user", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const session = req.session;

    if (req.body.username == myusername && req.body.password == mypassword){
        session.userID =username;
        const message = `<h1> Hello, ${req.body.username} </h1> <a href=\'/logout'>click to logout</a>`;
        res.send(message)
    } else {
        const message = `<h1> Unauthenticated User <\h1>`;
        res.send(message)
    }
})

app.get("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("App running");
});