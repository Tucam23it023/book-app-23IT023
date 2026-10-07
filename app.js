const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const sessionMiddleware = require('./config/session');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Bắt buộc khi chạy sau proxy của Render, để cookie secure hoạt động
app.set('trust proxy', 1);

// Cấu hình Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    money: (n) => Number(n).toLocaleString('vi-VN') + ' đ',
  },
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Đọc dữ liệu từ form
app.use(express.urlencoded({ extended: true }));

// Session lưu trên Atlas
app.use(sessionMiddleware);

// Biến dùng chung cho footer ở mọi trang
app.use((req, res, next) => {
  res.locals.studentName = process.env.STUDENT_NAME;
  res.locals.studentId = process.env.STUDENT_ID;
  res.locals.vat = Number(process.env.STUDENT_ID.slice(-1)) + 4;
  next();
});

// Đường dẫn kiểm tra sống (dùng cho UptimeRobot ở phần Render)
app.get('/health', (req, res) => res.send('OK'));

app.use('/', booksRouter);

app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));