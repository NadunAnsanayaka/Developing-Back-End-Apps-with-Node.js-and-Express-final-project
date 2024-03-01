const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a new review
regd_users.post("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; // Assuming the review is sent in the request body

  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    // Add the new review to the book's reviews
    books[isbn].reviews[req.user.username] = review;

    // Send a success message
    res.status(200).json({ message: "Review added successfully" });
  } else {
    // If the ISBN is not found, send a 404 response with a message
    res.status(404).json({ message: "Book not found for the provided ISBN" });
  }
});

// Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const modifiedReview = req.body.modifiedReview; // Assuming the modified review is sent in the request body

  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;

    // Check if the user has a review for this book
    if (bookReviews.hasOwnProperty(req.user.username)) {
      // Modify the user's review
      bookReviews[req.user.username] = modifiedReview;

      // Send a success message
      res.status(200).json({ message: "Review modified successfully" });
    } else {
      // If the user doesn't have a review, send a message
      res
        .status(404)
        .json({ message: "No review found for the provided user and ISBN" });
    }
  } else {
    // If the ISBN is not found, send a 404 response with a message
    res.status(404).json({ message: "Book not found for the provided ISBN" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Check if the ISBN exists in the books object
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;

    // Check if the user has a review for this book
    if (bookReviews.hasOwnProperty(req.user.username)) {
      // Delete the user's review
      delete bookReviews[req.user.username];

      // Send a success message
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // If the user doesn't have a review, send a message
      res
        .status(404)
        .json({ message: "No review found for the provided user and ISBN" });
    }
  } else {
    // If the ISBN is not found, send a 404 response with a message
    res.status(404).json({ message: "Book not found for the provided ISBN" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
