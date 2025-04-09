const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  imageUrl: String,
});
const Profile = mongoose.model("Profile", profileSchema);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream({ folder: "profile-pics" }, async (error, result) => {
      if (result) {
        const { name, email } = req.body;
        const profile = new Profile({ name, email, imageUrl: result.secure_url });
        await profile.save();
        return res.status(200).json(profile);
      } else {
        return res.status(500).json({ error: "Upload failed" });
      }
    });

    Readable.from(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});
