const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer();
const PORT = 3000; // 本地运行端口

// 中间件：解析表单数据
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(upload.none()); // 处理 multipart/form-data

// 邮件发送路由
app.post('/submit', (req, res) => {
  
  console.log('Received form data:', req.body);
  const { name, email, message, product } = req.body; // 增加对 product 字段的解析
  if (!name || !email || !message || !product) { // 验证 product 字段是否存在
    console.error('Missing form data:', req.body);
    return res.status(400).send('Missing form data.');
  }

  // 创建邮件传输器
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true, // 使用 SSL 加密
    auth: {
      user: 'chenhansheng@yongxiang-nb.com', // 你的 QQ 邮箱
      pass: 'Chs19971211.', // 你的 QQ 邮箱授权码
    },
  });

  const mailOptions = {
    from: 'chenhansheng@yongxiang-nb.com', // 固定发件人（你的邮箱）
    to: 'chenhansheng@yongxiang-nb.com', // 收件人（你的邮箱）
    subject: `New Inquiry from ${name}`, // 邮件主题，带上用户姓名
    text: `You have received a new inquiry:\n\nName: ${name}\nEmail: ${email}\nProduct: ${product}\nMessage: ${message}`, // 邮件正文，新增 Product 信息
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email.');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully!');
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
