import nodemailer from 'nodemailer';

async function sendOrderConfirmationEmail(userEmail, orderDetails) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: '"PrintZet" <noreply@printzet.com>',
    to: userEmail,
    subject: "Order Confirmation",
    html: `<h3>Your order is confirmed!</h3><p>Order ID: ${orderDetails.id}</p>`
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
}

export default sendOrderConfirmationEmail;