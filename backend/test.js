const express = require("express");
const app = express();

app.use(express.json());

const PORT = 5001;

app.get("/", (req, res) => {
    console.log("Hey, I am the server");
    return res.status(200).json("API health is fine");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
