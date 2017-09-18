'use strict';

const nodemailer = require('nodemailer');
var password = require('./credentials.js').gmailPassword;

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
function sendEmail(mailOptions){
nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "secretbabbo17@gmail.com", // generated ethereal user
            pass: password  // generated ethereal password
        }
    });


    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
}

module.exports = {
  sendEmail : sendEmail
}