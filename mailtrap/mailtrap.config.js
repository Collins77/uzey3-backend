const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

const sender = {
	email: "noreply@uzima.ai",
	name: "Uzima AI",
};

module.exports = {mailtrapClient, sender}
