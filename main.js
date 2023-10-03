const form = document.querySelector('.form');
const titleInput = document.querySelector('#input-title');
const authorInput = document.querySelector('#input-author');
const searchTitleInput = document.querySelector('#search-title');
const addBookBtn = document.querySelector('#add-book-btn');

class Book {
  constructor(title = null, author = null) {
    this.title = title;
    this.author = author;
    this.books = this.getExistingBooks() || [];
    this.bookShelf = document.querySelector('.books-container');
  }

  generateRandomId = () => Math.random().toString(20).substr(2, 20);

  getExistingBooks = () => JSON.parse(localStorage.getItem('books')) || [];

  saveToLocalStorage = (books) => {
    localStorage.setItem('books', JSON.stringify(books));
  };

  addBooks() {
    const newBook = {
      title: this.title,
      author: this.author,
      id: this.generateRandomId(),
    };

    this.books.push(newBook);
    this.saveToLocalStorage(this.books);
    this.displayBooks();
  }

  removeBook(bookId) {
    this.books = this.books.filter(
      (existingBook) => existingBook.id !== bookId
    );
    this.saveToLocalStorage(this.books);
    this.displayBooks();
  }

  editBook(bookId, newTitle, newAuthor) {
    const bookToEdit = this.books.find(
      (existingBook) => existingBook.id === bookId
    );

    if (bookToEdit) {
      bookToEdit.title = newTitle;
      bookToEdit.author = newAuthor;
      this.saveToLocalStorage(this.books);
      this.displayBooks();
    }
  }

  displayBooks() {
    this.bookShelf.innerHTML = '';
    this.books.forEach((book, index) => {
      const textHtml = `
      <div class="book ${index % 2 === 0 ? 'silver-books' : ''}">
        <p class="book-title">${book.title}</p><span>by</span>
        <p class="book-author">${book.author}</p>
        <button class="remove-btn" data-id=${book.id}>Remove</button>
        <button class="edit-btn" data-id=${book.id}>Edit</button>
      </div>`;

      this.bookShelf.insertAdjacentHTML('afterbegin', textHtml);
    });

    // Add event listeners to the new "Edit" and "Remove" buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach((removeBtn) => {
      removeBtn.addEventListener('click', (event) => {
        const bookId = event.target.dataset.id;
        this.removeBook(bookId);
      });
    });

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach((editBtn) => {
      editBtn.addEventListener('click', (event) => {
        const bookId = event.target.dataset.id;
        const bookToEdit = this.books.find(
          (existingBook) => existingBook.id === bookId
        );

        if (bookToEdit) {
          const newTitle = prompt("Enter the new title:", bookToEdit.title);
          const newAuthor = prompt("Enter the new author:", bookToEdit.author);

          if (newTitle !== null && newAuthor !== null) {
            this.editBook(bookId, newTitle, newAuthor);
          }
        }
      });
    });
  }

  findBookByTitle(searchTitle) {
    return this.books.filter(
      (book) =>
        book.title.toLowerCase() ===
        searchTitle.toLowerCase()
    );
  }
}

const book = new Book();

book.displayBooks();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (titleInput.value.trim() !== '' && authorInput.value.trim() !== '') {
    book.title = titleInput.value.trim();
    book.author = authorInput.value.trim();
    book.addBooks();
    titleInput.value = '';
    authorInput.value = '';
  }
});

addBookBtn.addEventListener('click', () => {
  if (titleInput.value.trim() !== '' && authorInput.value.trim() !== '') {
    book.title = titleInput.value.trim();
    book.author = authorInput.value.trim();
    book.addBooks();
    titleInput.value = '';
    authorInput.value = '';
  }
});

function findBooksByTitle() {
  const searchTitle = searchTitleInput.value.trim();
  const foundBooks = book.findBookByTitle(searchTitle);

  if (foundBooks.length > 0) {
    alert(`Found ${foundBooks.length} book(s) by title "${searchTitle}".`);
  } else {
    alert(`No books found with title "${searchTitle}".`);
  }
}

const searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', findBooksByTitle);
