const gmail = require("gmail-send");


async function sendMail(options) {
	console.log(process.env.GMAIL, process.env.GMAILPASS,)
	const mail = gmail({
		user: process.env.GMAIL, pass: process.env.GMAILPASS,
		to: options.to, subject: options.subject
	});

	return await mail({
		text: options.text
	});

}

module.exports = {
	sendMail: sendMail
}