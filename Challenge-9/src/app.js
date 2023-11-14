import "dotenv/config"; // Allows me to use environment variables
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import path from "path";
import router from "./routes/app.routes.js";
import passport from "passport";
import { messagesSocketController } from "./controllers/sockets/messagesSocketController.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import initializePassport from "./config/passport.js";
import { logger, addLogger } from "./utils/logger.js";

//IMPORTING ERRORS MIDDLEWARE
import errorMiddleware from "./middlewares/index.js";

const app = express();
const PORT = 4000;

//Server
const server = app.listen(PORT, () => {
    logger.info(`Server on port ${PORT}`);
});
const io = new Server(server);

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Socket.io connection");
    socket.on("message", (info) => messagesSocketController(io, info));
});

//MongoDB Atlas connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET)); //Firmo la cookie para que no puedan modificarlas o si las modifican que queden invalidas
app.use(
    session({
        //Configuracion de la sesion de mi app
        //store: new fileStorage({path: './sessions', ttl: 10000, retries: 1}),
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 60 * 60, // (Esto es en segundos,  no milisegundos)
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/", router);
app.use(errorMiddleware); // <- Usamos el middleware DESPUES de la ruta / sino no podemos usar los next
app.use(addLogger)

//HBS configuration
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "views"));

//Cookies
app.get("/setCookie", (req, res) => {
    res
        .cookie("Cookie1", "Este es el valor de una cookie", {
            maxAge: 60000,
            signed: true,
        })
        .send("Cookie creada"); //Cookie de un minuto firmada
});

app.get("/getCookie", (req, res) => {
    res.send(req.signedCookies); // Consulta solo las cookies firmadas
    //res.send(req.cookies) Consulta TODAS las cookies
});