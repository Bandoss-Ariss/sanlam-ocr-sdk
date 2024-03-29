import path from "path";
import { fileURLToPath } from "url";
import express, { response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import SanlamOcrSDK from "../index.cjs";


// Server initialization
const app = express();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage:storage });
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(__dirname + "/public"));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Initialization du SDK
const ocr = new SanlamOcrSDK(
	"L80rxMo5d9Cfsx2KnJQj275V9uCc8Yx0",
	"RNN"
);


app.get("/loadSanlamSDK", (req, res) => {
	res.sendFile(__dirname + "/public/fileUpload.html");
});

app.post("/uploadFile", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'verso', maxCount: 1 }]), async (req, res) => {
	console.log("Recto details: ", req.files.file[0]);
	console.log("Verso details: ",req.files.verso[0]);

	if (req.body.operation === "cin") {

		let userInfo = await ocr.extraireInfosDocument("cin", req.files.file[0].path, req.files.verso[0].path);
		console.log(userInfo);
		res.json({userInfo:userInfo});
		//console.log(response);
	}
	else if (req.body.operation === "permis"){
		let response = await ocr.extraireInfosDocument("permis", req.files.file[0].path);
		console.log(response);
		res.json({userInfo:response});
	}
	else if (req.body.operation === "carte_grise"){
		let response = await ocr.extraireInfosDocument("carte_grise", req.files.file[0].path, req.files.verso[0].path);
		console.log(response);
		res.json({userInfo:response});
	}
	else if (req.body.operation === "old_cin"){
		let response = await ocr.extraireInfosDocument("old_cin", req.files.file[0].path, req.files.verso[0].path);
		console.log(response);
		res.json({userInfo:response});
	} else if (req.body.operation === "passeport"){
		let response = await ocr.extraireInfosDocument("passeport", req.files.file[0].path, req.files.verso[0].path);
		console.log(response);
		res.json({userInfo:response});
	}
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
	if (err) console.error("Node.js server error: ", err);
	else console.log(`Server started on port ${PORT}...`);
});
