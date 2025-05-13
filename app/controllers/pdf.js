const fs = require('fs');
const { ROOT_PATH, OUTPUT_PATH } = require('../utils/constant-path');
const path = require('path');
const { convert } = require('image-to-pdf');
const Stats = require('../utils/stats');
const { exec } = require('child_process');
module.exports = class PdfController {

    static getTargetFolders() {
        return fs.readdirSync(ROOT_PATH)
            .filter(folder => fs.statSync(path.join(ROOT_PATH, folder)).isDirectory());
    }

    static async generatePdf(files, folder) {
        if (files.length === 0) return; 

        const outputPath = path.join(OUTPUT_PATH, `${folder}.pdf`);

        await new Promise((resolve, reject) => {
            const pdfStream = convert(files, 'A4').pipe(fs.createWriteStream(outputPath));
            pdfStream.on('finish', resolve);
            pdfStream.on('error', reject);
        });

        this.compressPdfSize(outputPath);
    }

    static compressPdfSize(pdfPath) {
        const compressedPath = pdfPath.replace('.pdf', '_compressed.pdf');
        const gsCommand = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${compressedPath}" "${pdfPath}"`;

        exec(gsCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Ghostscript compression failed: ${error.message}`);
                return;
            }

            // Overwrite original PDF with compressed one
            fs.rename(compressedPath, pdfPath, (err) => {
                if (err) {
                    console.error(`Failed to overwrite with compressed PDF: ${err.message}`);
                } else {
                    console.log(`Compressed PDF saved: ${pdfPath}`);
                }
            });
        });
    }

    static getFilesFromTargetFolders() {

        // initialise the result file for output
       Stats.initializeResultFile();

        this.getTargetFolders().forEach(folder => {
            const folderPath = path.join(ROOT_PATH, folder);
            const files = fs.readdirSync(folderPath)
                .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
                .map(file => path.join(folderPath, file));

            // insert data in the file
            let textClass = new Stats(folder,files.length)
            textClass.insertStatsInResultFile()
            this.generatePdf(files, folder);
        });
    }

    static generatePDFfromFolders(req,res,next) {
        PdfController.getFilesFromTargetFolders();
        res.render("index", { message: "All folders converted successfully!" });
    }
};
