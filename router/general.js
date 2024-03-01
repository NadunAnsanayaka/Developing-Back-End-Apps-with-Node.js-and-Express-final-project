const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Extracting book titles from the books object
  // const bookTitles = Object.values(books).map(book => book.title);
  // res.send(bookTitles);
  res.send(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnToSearch = req.params.isbn;
  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbnToSearch)) {
    // If found, send the book details for the specified ISBN
    res.send(books[isbnToSearch]);
  } else {
    // If not found, send a 404 response with a message
    res.status(404).json({ message: "Book not found for the provided ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorToSearch = req.params.author;
  // Find books with the specified author
  const matchingBooks = Object.values(books).filter(book => book.author === authorToSearch);

  // Check if any books are found
  if (matchingBooks.length > 0) {
    // If found, send the details of matching books
    res.send(matchingBooks);
  } else {
    // If not found, send a 404 response with a message
    res.status(404).json({ message: "Books not found for the provided author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToSearch = req.params.title;
  // Find books with the specified title
  const matchingBooks = Object.values(books).filter(book => book.title === titleToSearch);

  // Check if any books are found
  if (matchingBooks.length > 0) {
    // If found, send the details of matching books
    res.send(matchingBooks);
  } else {
    // If not found, send a 404 response with a message
    res.status(404).json({ message: "Books not found for the provided title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnToSearch = req.params.isbn;

  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbnToSearch)) {
    const bookReviews = books[isbnToSearch].reviews;

    // Check if the book has reviews
    if (Object.keys(bookReviews).length > 0) {
      // If found, send the reviews for the specified ISBN
      res.send(bookReviews);
    } else {
      // If no reviews found, send a message
      res.status(404).json({ message: "No reviews found for the provided ISBN" });
    }
  } else {
    // If the ISBN is not found, send a 404 response with a message
    res.status(404).json({ message: "Book not found for the provided ISBN" });
  }
});

module.exports.general = public_users;
