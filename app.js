'use strict'

const express = require("express");
require('dotenv').config()
const PdfController = require("./controllers/pdf");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));



// app.get("/", (req, res) => {
//     // res.render("index", { message: null });
//     PdfController.getTargetFolders()
// });


app.listen(3000, () => {
    PdfController.generatePDFfromFolders()
    console.log("Server running at http://localhost:3000");
});
