const mongoose = require('mongoose');
const { readConn, writeConn } = require('../config/db');

const bookSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, default: '' },
    price: { type: Number, required: true },         // giá gốc
    vat: { type: Number, required: true },           // % VAT
    priceAfterTax: { type: Number, required: true }, // giá sau thuế
  },
  { timestamps: true, autoIndex: false, autoCreate: false }
);

const COLLECTION = process.env.COLLECTION_NAME || 'Tucambooks';

// Cùng một schema, gắn vào 2 kết nối khác nhau
const BookRead = readConn.model('Book', bookSchema, COLLECTION);   // chỉ dùng để ĐỌC
const BookWrite = writeConn.model('Book', bookSchema, COLLECTION); // chỉ dùng để GHI

module.exports = { BookRead, BookWrite };