import path from "path";
import { fileURLToPath } from "url";
import express, { response } from "express";
import dotenv from "dotenv";


// Server initialization
const app = express();
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(__dirname + "/public"));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});
app.get("/after-scan", (req, res) => {
	res.sendFile(__dirname + "/public/after.html");
});

// Server port
const PORT = process.env.PORT || 7000;
app.listen(PORT, (err) => {
	if (err) console.error("Node.js server error: ", err);
	else console.log(`Server started on port ${PORT}...`);
});
