import express from "express";
import bodyParser from "body-parser";
import textToSpeech from "@google-cloud/text-to-speech";
import AWS from "aws-sdk";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Google Cloud client
const googleClient = new textToSpeech.TextToSpeechClient({
  keyFilename: "google-credentials.json" // ⚠️ put in .gitignore if committing
});

// Amazon Polly client
const polly = new AWS.Polly({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// POST /tts
app.post("/tts", async (req, res) => {
  try {
    const { text, lang, voice, provider } = req.body;

    if (!text) {
      return res.status(400).send("Text required");
    }

    if (provider === "google") {
      const [response] = await googleClient.synthesizeSpeech({
        input: { text },
        voice: { languageCode: lang, name: voice || `${lang}-Wavenet-A` },
        audioConfig: { audioEncoding: "MP3" }
      });
      res.set("Content-Type", "audio/mpeg");
      return res.send(response.audioContent);
    }

    if (provider === "amazon") {
      const result = await polly.synthesizeSpeech({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: voice || "Aditi",
        LanguageCode: lang || "en-IN"
      }).promise();
      res.set("Content-Type", "audio/mpeg");
      return res.send(result.AudioStream);
    }

    res.status(400).send("Invalid provider");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating speech");
  }
});

app.listen(PORT, () => {
  console.log(`TTS backend running on http://localhost:${PORT}`);
});
