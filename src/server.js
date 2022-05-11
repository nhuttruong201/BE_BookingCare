import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
import { connectDB } from "./config/connectDB";
import configCORS from "./config/CORS";
require("dotenv").config();

let app = express();
configCORS(app);

const port = process.env.PORT || 6969;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);
initWebRoute(app);

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
