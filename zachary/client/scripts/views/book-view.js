'use strict';
var app = app || {};

(function(module) {
  $('.icon-menu').on('click', function(event) {
    $('.nav-menu').slideToggle(350);
  })

  function resetView() {
    $('.container').hide();
    $('.nav-menu').slideUp(350);
  }

  const bookView = {};

  bookView.initIndexPage = function(ctx, next) {
    resetView();
    $('.book-view').show();
    $('#book-list').empty();
    module.Book.all.map(book => $('#book-list').append(book.toHtml()));
    next()
  }

  bookView.initDetailPage = function(ctx, next) {
    resetView();
    $('.detail-view').show();
    $('.book-detail').empty();
    let template = Handlebars.compile($('#book-detail-template').text());
    $('.book-detail').append(template(ctx.book));

    $('#update-btn').on('click', function() {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', function() {
      module.Book.destroy($(this).data('id'));
    });
    next()
  }

  bookView.initCreateFormPage = function() {
    resetView();
    $('.create-view').show();
    $('#create-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    })
  }

  bookView.initUpdateFormPage = function(ctx) {
    resetView();
    $('.update-view').show()
    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    })
  };

// COMMENT: What is the purpose of this method?
// Answer: this method will search through the form for a specific book or books depending on what the user inputs.
  bookView.initSearchFormPage = function() {
    resetView();
    $('.search-view').show();
    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      //Answer: The default behavior being prevented here is this prevents the page from searching for a book/books upon the page being loaded or reloaded. 
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      //Answer: event.target tells the application to search for a book by title, author and isbn by default OR to search for what the user has input.  If the user does not provide the information needed for the title, author, or isbn properties no book would display upon searching, as the application would not have the key pieces to complete the search.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // Answer: these values are set to empty strings because the application is expecting the user to manually input the values.
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  //  Answer: this method tells the app to display the search results on the screen to the user.  The list of book(s) the user manually input data for to be searched will be cleared for another search after displaying the results.
  bookView.initSearchResultsPage = function() {
    resetView();
    $('.search-results').show();
    $('#search-list').empty();

    // COMMENT: Explain how the .map() method is being used below.
    // answer: the .map() method is adding every book to the array of all Books.
    module.Book.all.map(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', function(e) {
      // COMMENT: Explain the following line of code.
      // Answer:  is finding a unique book_id from the array of all Books.
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  // COMMENT: Explain the following line of code. 
  // Answer:  module is allowing us to reassign the const variable bookView to a value also called bookView.  It's because of module. that we are able to do this.
  module.bookView = bookView;
  
  // COMMENT: Explain the following line of code. 
  // Answer: this is essentially the equivalant of a closing bracket in HTML.  We have wrapped this entire page in a module and })(app), allowing us to use any of the methods in any other files that have also been wrapped in the module app pattern.  It's kinda like turning this file into one giant app object that we can call on properties/methods from using the app. notation...all thanks to the module pattern.
})(app)

