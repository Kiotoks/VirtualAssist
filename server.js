const express = require('express');
const openai = require('openai');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const port =  process.env.PORT || 3030;
const ejs = require('ejs');
require('dotenv').config();

const app = express();

const chatGPTAPIKey = process.env.OPENAI_KEY;
const openaiClient = new openai({ apiKey: chatGPTAPIKey });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function transcribir(file) {
    return await openaiClient.audio.transcriptions.create({
      file: fs.createReadStream(__dirname +"/uploads/" + file),
      model: "whisper-1",
    });
  
}

app.post('/upload', upload.single('audio'), (req, res) => {
    transcribir(req.file.filename).then(transcription =>{
        console.log(transcription);
        res.send("mensaje transcripto");
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
