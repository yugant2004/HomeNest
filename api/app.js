import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";


const app=express();

// Configure CORS with proper options
app.use(cors({
  origin: "http://localhost:5173", // Client URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});


app.use("/api/auth",authRoute);

app.use("/api/posts",postRoute);

app.use("/api/test",testRoute);

app.use("/api/users",userRoute);

app.use("/api/chats",chatRoute);

app.use("/api/messages",messageRoute);


app.listen(8800,()=>{
    console.log("server is running!");
});