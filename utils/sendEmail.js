// const mailchimp = require('@mailchimp/mailchimp_transactional')(`${process.env.MANDRILL_API_KEY}`);
var nodemailer = require("nodemailer");
var mandrillTransport = require('nodemailer-mandrill-transport');

const sendEmail = async (recipient, subject, msg) => {
	// console.log('API KEY: ', process.env.MANDRILL_API_KEY);
    // const message = {
    //     from_email: "hello@thebetforecast.com",
    //     subject: "CONFIRM SUBSCRIPTION",
    //     text: `Welcome to Mailchimp Transactional!`,
    //     to: [
    //         {
    //             email: "nomsouzoanya@yahoo.co.uk",
    //             type: "to"
    //         }
    //     ]
    // };

	// const res = await mailchimp.messages.send({ message });
	// console.log(res);

	var smtpTransport = nodemailer.createTransport(mandrillTransport({
		auth: {
		  apiKey : `${process.env.MANDRILL_API_KEY}`
		}
	}));
	
	// Put in email details.
	
	let mailOptions={
	   from: 'editor@thebetforecast.com',
	   to: recipient,
	   subject,
	   html: msg
	};
	
	// Sending email.
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error) {
			throw new Error("Error in sending email");
		}
		console.log("Message sent: " + JSON.stringify(response));
	});
};
  
module.exports = sendEmail;