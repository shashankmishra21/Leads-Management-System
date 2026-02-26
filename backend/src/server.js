require("dotenv").config();
const express = require("express")
const app = express()
const connectDB = require("./config/db")
const cors = require("cors");
const leadRoutes = require("./routes/leadRoutes")
const authRoutes = require("./routes/authRoutes")
const emailRoutes = require("./routes/emailRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRoutes)
app.use("/api/leads/", leadRoutes)
app.use("/api/email",  emailRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Project Working" })
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});