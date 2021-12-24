const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const app = express()

const accessTokenSecret = process.env.TOKEN_SECRET;
dotenv.config()
app.use(bodyParser.json())

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

const books = [
    {
      "author": "Robert Martin",
      "country": "USA",
      "language": "English",
      "pages": 209,
      "title": "Clean Code",
      "year": 2008
    },
    {
      "author": "Dave Thomas & Andy Hunt",
      "country": "USA",
      "language": "English",
      "pages": 784,
      "title": "The Pragmatic Programmer",
      "year": 1999
    },
    {
      "author": "Kathy Sierra, Bert Bates",
      "country": "USA",
      "language": "English",
      "pages": 928,
      "title": "Head First Java",
      "year": 2003
    },
    ];

    app.get('/books', authenticateJWT ,(req, res) => { 
      res.json(books);
  });

  app.post("/books", authenticateJWT, (req,res) => {
    if(req.user.role === "admin") {
      const newBooks = {
        author: req.body.author,
        country: req.body.country,
        language: req.body.language,
        pages: req.body.pages,
        title: req.body.title,
        year: req.body.year
      }
      books.push(newBooks);
      res.send("Berhasil Ditambahkan")
    }else{
      res.send("Anda bukan admin")
    }
  })

  app.listen(4000, () => {
    console.log(`Running in Port 4000`)
  });
