/*
This app uses ES5 syntax to allow the user to add books to and remove them from a list displayed in the ui.
There are two main components to this app: the Book constructor and the UI constructor. The book constructor instantiates new book objects, while the UI constructor is a container that holds methods on its prototype for adding to and removing Book instances from a list in the ui. The ui also displays a message when a book has been added or removed, as well as an error message if the user attempts to add incomplete data.
CHALLENGE: Persist book data in local storage DONE!!
*/

// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}
 
// UI Constructor - basically a container for ui methods on its prototype
function UI() {}

// Add Book to list in UI
UI.prototype.addBookToList = function(book) {
  const list = document.getElementById('book-list');
  // create tr element
  const row = document.createElement('tr');
  // insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
  list.appendChild(row);
}

// Show alert in UI
UI.prototype.showAlert = function(message, className) {
  // create div
  const div = document.createElement('div');
  // add classes
  div.className = `alert ${className}`;
  // add textNode
  div.appendChild(document.createTextNode(message));
  // get parent
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  // Insert alert
  container.insertBefore(div, form)
  // make disappear
  setTimeout(function(){
    document.querySelector('.alert').remove()
  }, 3000)
}

// delete book from UI
UI.prototype.deleteBook = function(target) {
  if(target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// clear UI fields
UI.prototype.clearFields = function() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}


// Local Storage Constructor
function LS() {}

// add book to local storage
LS.prototype.addBookToStore = function(book) {
    const ls = new LS;
    const books = ls.getBooksFromStore();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  console.log('add books to store');
}
// get books from local storage
LS.prototype.getBooksFromStore = function() {
  let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}
// display books from local storage to UI
LS.prototype.displayBooks = function() {
  const ls = new LS;
  const books = ls.getBooksFromStore();
    books.forEach(function(book) {
      const ui = new UI;
      // Add book to ui
      ui.addBookToList(book);
      // console.log(ui);
    });
}

// remove books from local storage
LS.prototype.removeBookFromStore = function(isbn) {
  const ls = new LS;
  const books = ls.getBooksFromStore();

    books.forEach(function(book, index) {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
  const ls = new LS;
// DOM load event
document.addEventListener('DOMContentLoaded', ls.displayBooks())
}
// call loadBooks on page load
loadBooks();

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit',
  function(e) {
    // Get form input values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value
    // Instantiate a new book object from constructor
    const book = new Book(title, author, isbn);
    // Instantiate a UI object, making all UI prototype methods available
    const ui = new UI();
    // Instantiate a new local storage object
    const ls = new LS();
    // validate user input
    if(title === '' || author === '' || isbn === '') {
      // error alert
      ui.showAlert('Please fill in all fields before submitting!', 'error');
    } else {
      // Add book to ui list
      ui.addBookToList(book);
      // Add book to local storage
      ls.addBookToStore(book);
      // Show success
      ui.showAlert('Book added successfully!', 'success');
      // clear UI form fields
      ui.clearFields();
    }
    e.preventDefault();
});

// event listener for delete button
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();
  const ls = new LS();
  ui.deleteBook(e.target);
  ls.removeBookFromStore(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book deleted!', 'success'); 
  e.preventDefault();
});