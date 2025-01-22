const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { connectDB } = require("./db/connectDB.js");

const authRoutes = require("./routes/authRoutes.js");
const assistantRoutes = require("./routes/assistantRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const planRoutes = require("./routes/planRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");

const bodyParser = require("body-parser")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get('/', (req, res) => {
	res.send("Hello Server!")
})

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/uzima-front/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "uzima-front", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});