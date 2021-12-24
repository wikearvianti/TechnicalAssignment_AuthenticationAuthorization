const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const port = 3000;
const app = express();
const accessTokenSecret = 'youraccesstokensecret';
const dotenv = require("dotenv")

dotenv.config()

const authenticateJWT = (req,res,next) => {
    // const authHeader adalah menangkap request clien dengan authorizationnya, yang isinya (token)
    const authHeader = req.headers.authorization;
    if(authHeader) {
        //hanya mengambil token saja
        const token = authHeader.split('')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => { //jwt.verify itu memverifikasi token bahwa sudah sesuai apa belum
            if(err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
  };


const users = [
    {
        username: 'terra',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'dave',
        password: 'password123member',
        role: 'member'
    }
  ];


app.use(bodyParser.json());

app.get("/ping", (req,res) => {
    res.send("SUCCESS")
});

app.post("/login", (req, res) => {
    const {username, password} = req.body
    const user = users.find(user => {
        return ((user.username === username) && (user.password === password))
    })
    if(user){
        const token = jwt.sign({username: user.username, role: user.role}, accessTokenSecret)
        res.json({
            accessToken: token
        })
    } else {
        res.send("Username or password incorrect")
    }
})

app.listen(port, () => {
    console.log (`Running in Port ${port}`)
})