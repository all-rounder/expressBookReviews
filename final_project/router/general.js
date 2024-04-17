const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // const booksJSON = JSON.stringify(books, null, 4);
  await res.send({"books": books});
});

// public_users.get('/', function (req, res) {
//   let getBooks = new Promise((resolve,reject)=>{
//     const booksJSON = JSON.stringify(books, null, 4);
//     resolve(booksJSON);
//   });
//   getBooks.then(booksJSON => {res.send(booksJSON);});
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let bookByISBN = {};
  let flagFind = false;

  let getBook = new Promise((resolve, reject) => {
    for (const key in books) {
      if (key == isbn) {
        bookByISBN = books[isbn];
        flagFind = true;
      }
    }
    if (flagFind) resolve(bookByISBN)
      else reject("Not found.");
  });

  getBook.then(bookByISBN => {res.send(bookByISBN)}).catch(err => {res.send(err)});

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let book = {};
  
  let getBooks = new Promise((resolve,reject) => {
    for (const key in books) {
      if (books[key].author == author) {
        book.isbn = key;
        book.title = books[key].title;
        book.reviews = books[key].reviews;
        booksByAuthor.push(book);
      }
    }
    if (booksByAuthor.length > 0) resolve(booksByAuthor)
      else reject("Not found.");
  });
  
  getBooks.then(booksByAuthor => {res.send({"booksByAuthor": booksByAuthor});})
  .catch(err => {res.send(err)});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    let book = {};

    let getBooks = new Promise((resolve,reject) => {
      for (const key in books) {
        if (books[key].title == title) {
            book.isbn = key;
            book.author = books[key].author;
            book.reviews = books[key].reviews;
            booksByTitle.push(book);
        }
      }
      if (booksByTitle.length > 0) resolve(booksByTitle)
      else reject("Not found.");
    });

    getBooks.then(booksByTitle => {res.send({"booksByTitle":booksByTitle});})
    .catch(err => {res.send(err)});;
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
