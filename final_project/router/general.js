const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  //Done
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    const exists = users.filter((user) => user.username === username);

    if (exists.length === 0){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user: Username and/or password not provided." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Dome
    const getBooks = new Promise((resolve, reject) => {
        try {
            resolve(books); 
        } catch (err) {
            reject(err);
        }
    });

    getBooks
        .then((data) => {
            res.send(JSON.stringify(data, null, 4));
        })
        .catch((err) => {
            res.status(500).send("Error fetching books");
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Done
    const isbn = req.params.isbn;
  
    const findBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found.");
      }
    });
  
    findBook
      .then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
      })
      .catch((err) => {
        return res.status(404).json({ message: err });
      });
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      let filteredBooks = [];
  
      keys.forEach((key) => {
        if (books[key].author === author) {
          filteredBooks.push({
            isbn: key,
            ...books[key]
          });
        }
      });
  
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found for this author.");
      }
    });
  
    getBooksByAuthor
      .then((booksByAuthor) => {
        res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  });

// Get all books based on title
ppublic_users.get('/title/:title', function (req, res) {
    //Done
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        let filteredBooks = [];

        keys.forEach((key) => {
            if (books[key].title === title) {
                filteredBooks.push({
                    isbn: key,
                    ...books[key]
                });
            }
        });

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found for this title.");
        }
    });

    getBooksByTitle
        .then((booksByTitle) => {
            res.status(200).send(JSON.stringify(booksByTitle, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Done
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book){
    return res.status(200).send(JSON.stringify(book.reviews,null,4));
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});

module.exports.general = public_users;
