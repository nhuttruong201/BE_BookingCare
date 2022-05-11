import express from "express";

const configViewEngine = (app) => {
   app.use(express.static("./src/public"));
   app.set("view engin", "ejs");
   app.set("views", "./src/views");
};

export default configViewEngine;
