const nodemailer = require('nodemailer')


const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: html
        });

        return {status:true, msg:"email sent sucessfully"};
    } catch (error) {
        return {status:false, msg:error};
    }
};

module.exports = sendEmail;
