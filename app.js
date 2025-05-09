const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const imageToPdf = require("image-to-pdf").default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const ROOT_FOLDER = path.join(__dirname, "public", "ROOT_CONTAINER");

app.get("/", (req, res) => {
    res.render("index", { message: null });
});

app.post("/convert", async (req, res) => {
    try {
        const folders = fs.readdirSync(ROOT_FOLDER);

        for (let folder of folders) {
            const folderPath = path.join(ROOT_FOLDER, folder);

            if (fs.statSync(folderPath).isDirectory()) {
                const files = fs.readdirSync(folderPath)
                    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
                    .map(file => path.join(folderPath, file));

                if (files.length > 0) {
                    const pdfPath = path.join(__dirname, "public", "output", `${folder}.pdf`);

                    await new Promise((resolve, reject) => {
                        const pdfStream = imageToPdf(files, 'A4').pipe(fs.createWriteStream(pdfPath));
                        pdfStream.on('finish', resolve);
                        pdfStream.on('error', reject);
                    });
                }
            }
        }

        res.render("index", { message: "All folders converted successfully!" });
    } catch (err) {
        console.log("Error caught:", err.message);
        res.render("index", { message: `Error: ${err.message}` });
    }
});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
