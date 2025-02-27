const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/ConnectDb");
const NoteRouter = require("./routes/NoteRoutes");

dotenv.config()
connectDB()

const app = express();


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(bodyParser.json())


//Routes
app.use("/api/notes", NoteRouter)


app.get("/" ,(req,res)=> {res.send("page was worked")})



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));