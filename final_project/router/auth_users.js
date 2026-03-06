const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Done
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in: Username and password required"});
  }

  const authenticatedUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (authenticatedUser.length > 0) {
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).json({message: "User successfully logged in!"});
  } else {
    return res.status(404).json({message: "Username and/or password are/is invalid!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];
  
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send(`Review for ISBN ${isbn} posted by user ${username} has been deleted.`);
        } else {
            return res.status(404).json({message: "Review not found or you do not have permission to delete it"});
        }
    } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
