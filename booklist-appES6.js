/*
This app uses ES6 syntax to allow the user to add books to and remove them from a list displayed in the ui.
*/

// the Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// the UI class (gets no constructor, as it is only a container for prototype methods)
class UI {
  addBookToList(book) {
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

  showAlert(message, className) {
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
    container.insertBefore(div, form);
    // make disappear
    setTimeout(function(){
      document.querySelector('.alert').remove()}, 3000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local storage class
class Store {
  static displayBooks() {
    const books = Store.getBooksFromStore();

    books.forEach(function(book) {
      const ui = new UI;
      // Add book to ui
      ui.addBookToList(book);
    });
  }
  static addBooktoStore(book) {
    const books = Store.getBooksFromStore();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }
  static getBooksFromStore() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static removeBookFromStore(isbn) {
    const books = Store.getBooksFromStore();

    books.forEach(function(book, index) {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks())

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
    // validate user input
    if(title === '' || author === '' || isbn === '') {
      // error alert
      ui.showAlert('Please fill in all fields before submitting!', 'error');
    } else {
      // Add book to ui list
      ui.addBookToList(book);

      // Add book to local storage
      Store.addBooktoStore(book);

      // Show success
      ui.showAlert('Book added successfully!', 'success');
      // clear UI form fields
      ui.clearFields();
    }
    e.preventDefault();
});

// event listener for delete button
document.getElementById('book-list').addEventListener('click', function(e){
  // Instantiate UI
  const ui = new UI();

  // Delete book from ui
  ui.deleteBook(e.target);

  // Remove book from local storage
  Store.removeBookFromStore(e.target.parentElement.previousElementSibling.textContent);
  // Show message
  ui.showAlert('Book deleted!', 'success'); 

  // prevent default behavior on event
  e.preventDefault();
});
