import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import morgan from "morgan"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(express.static(path.join(__dirname, "/public")))
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors(
  {
    origin: [process.env.CLIENTSIDE_URL, "http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true
  }
))
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

app.use((err, req, res, next) => {
  if (err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError') {
    err.status = 422
  }
  if (req.get('accept').includes('json')) {
    res.status(err.status || 500).json({ message: err.message || 'some error eccured.' })
  } else {
    res.status(err.status || 500).sendFile(path.join(__dirname, 'public', 'index.html'))
  }
})

const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))

    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

