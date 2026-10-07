const express = require('express');
const router = express.Router();
const { BookRead, BookWrite } = require('../models/book');

const STUDENT_ID = process.env.STUDENT_ID;           // "23IT023"
const PREFIX = STUDENT_ID.slice(-3);                 // "023"
const VAT = Number(STUDENT_ID.slice(-1)) + 4;        // 3 + 4 = 7

// ===== XEM DANH SÁCH: dùng kết nối ĐỌC =====
router.get('/', async (req, res) => {
  try {
    req.session.visits = (req.session.visits || 0) + 1; // minh họa session
    const books = await BookRead.find().sort({ createdAt: -1 }).lean();
    res.render('books', { books, visits: req.session.visits });
  } catch (e) {
    res.status(500).send('Lỗi đọc dữ liệu: ' + e.message);
  }
});

// ===== FORM THÊM SÁCH =====
router.get('/add', (req, res) => {
  res.render('add', { prefix: PREFIX });
});

// ===== THÊM MỚI: dùng kết nối GHI =====
router.post('/add', async (req, res) => {
  try {
    const code = (req.body.code || '').trim();
    const title = (req.body.title || '').trim();
    const author = (req.body.author || '').trim();
    const price = Number(req.body.price);

    // 1) Bộ lọc mã sản phẩm: bắt buộc bắt đầu bằng 3 số cuối MSSV
    if (!code.startsWith(PREFIX)) {
      return res.status(400).render('add', {
        prefix: PREFIX,
        error: `Mã sản phẩm phải bắt đầu bằng "${PREFIX}". Hệ thống từ chối xử lý.`,
      });
    }

    if (!title || isNaN(price) || price < 0) {
      return res.status(400).render('add', { prefix: PREFIX, error: 'Dữ liệu không hợp lệ.' });
    }

    // 2) Kiểm tra trùng mã (dùng kết nối ĐỌC vì user ghi không có quyền đọc)
    if (await BookRead.exists({ code })) {
      return res.status(400).render('add', { prefix: PREFIX, error: 'Mã sách đã tồn tại.' });
    }

    // 3) Tính giá sau thuế rồi lưu (dùng kết nối GHI)
    const priceAfterTax = Math.round(price * (1 + VAT / 100));
    await BookWrite.create({ code, title, author, price, vat: VAT, priceAfterTax });

    res.redirect('/');
  } catch (e) {
    res.status(500).render('add', { prefix: PREFIX, error: 'Lỗi ghi dữ liệu: ' + e.message });
  }
});

module.exports = router;