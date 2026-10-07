const mongoose = require('mongoose');

// Hai kết nối riêng biệt, mỗi kết nối dùng một tài khoản
const readConn = mongoose.createConnection(process.env.MONGO_URI_READ);
const writeConn = mongoose.createConnection(process.env.MONGO_URI_WRITE);

readConn.on('connected', () => console.log('✅ READ connection OK (user chỉ đọc)'));
writeConn.on('connected', () => console.log('✅ WRITE connection OK (user chỉ ghi)'));
readConn.on('error', (e) => console.error('❌ READ error:', e.message));
writeConn.on('error', (e) => console.error('❌ WRITE error:', e.message));

module.exports = { readConn, writeConn };