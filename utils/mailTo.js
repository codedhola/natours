const nodemailer = require("nodemailer");

const sendEmail = async function(details){

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 25 ,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        "from": "'coded-hola' <codedhola@dev.io>",
        "to": details.email,
        "subject": details.subject,
        "text": details.message
      })

    
}

module.exports = sendEmail;;