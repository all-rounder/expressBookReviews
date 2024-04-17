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

// const getBooks = new Promise((resolve,reject)=>{
//     try {
//         public_users.get('/',function (req, res) {
//             //Write your code here
//             const data = JSON.stringify(books, null, 4)
//             res.send(data);
//             //res.send(books);
//           });
//         resolve(data);
//       } catch(err) {
//         reject(err)
//       }
// });

// console.log('getBooks:' + getBooks);
// getBooks.then(
//   (data) => console.log(data),
//   (err) => console.log("Error")
// );

public_users.get('/',function (req, res) {
  //Write your code here
  let getBooks = new Promise((resolve,reject)=>{
    const books = JSON.stringify(books, null, 4);
    resolve(books);
  });
  getBooks.then(books => {res.send(books);});
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  let book = {};
  
  for (const key in books) {
    if (books[key].author == author) {
        book.isbn = key;
        book.title = books[key].title;
        book.reviews = books[key].reviews;
        booksByAuthor.push(book);
    }
  }

  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    let book = {};
    
    for (const key in books) {
      if (books[key].title == title) {
          book.isbn = key;
          book.author = books[key].author;
          book.reviews = books[key].reviews;
          booksByTitle.push(book);
      }
    }
  
    res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
