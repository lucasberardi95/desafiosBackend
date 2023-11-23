import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'lucasberardi.18@gmail.com',
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN'
    }
})

//Nodemailer functions

export const sendRecoveryEmail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'lucasberardi.19@gmail.com',
        to: email,
        subject: 'Password recovery link',
        text: `Click the following link ${recoveryLink}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        } else {
            console.log('Email sent successfully');
        }
    })
}