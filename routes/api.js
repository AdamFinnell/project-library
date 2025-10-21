'use strict';

const Book = require('../models/book');

module.exports = function(app) {


  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find({}, 'title _id comments').lean();
        const formatted = books.map(b => ({
          title: b.title,
          _id: b._id,
          commentcount: b.comments.length
        }));
        res.json(formatted);
      } catch (err) {
        res.status(500).send('Server error');
      }
    })
    .delete(async (req, res) => {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Server error');
      }
    });

 
  app.route('/api/books')
    .post(async (req, res) => {
      const { title } = req.body;
      if (!title) return res.send('missing required field title');

      try {
        const newBook = await Book.create({ title });
        res.json({ title: newBook.title, _id: newBook._id });
      } catch (err) {
        res.status(500).send('Server error');
      }
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      try {
        const book = await Book.findById(req.params.id).lean();
        if (!book) return res.send('no book exists');
        res.json({ title: book.title, _id: book._id, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })

    
    .post(async (req, res) => {
      const { comment } = req.body;
      if (!comment) return res.send('missing required field comment');

      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');

        book.comments.push(comment);
        await book.save();
        res.json({ title: book.title, _id: book._id, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })

    
    .delete(async (req, res) => {
      try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
