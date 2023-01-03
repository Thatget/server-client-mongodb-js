import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";

import { register } from "./controllers/auth.js";
import authRouters from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

import User from "./models/User.js";
import Post from "./models/Post.js";

import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/post", verifyToken, upload.single("picture"), createPost );

/* ROUTES */
app.use("/auth", authRouters);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOSE SETUP */
const PORT = process.env.PORT;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(PORT, () => {
    // User.insertMany(users);
    // Post.insertMany(posts);
    console.log(`Server Port ${PORT}`)
  })
}).catch((error) => console.log(`${error} did not connect`))
