import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lucasberardi.18@gmail.com',
        pass: 'lucasb1595'
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