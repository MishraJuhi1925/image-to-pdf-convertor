'use strict'

const express = require("express");
require('dotenv').config()
const app = express();
const path = require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));


// routes
const pdfRouter = require('./app/routes/pdf');

app.use('/pdf',pdfRouter)

app.get("/", (req, res) => {
    res.render("index", { message: null });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
