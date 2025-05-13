const fs = require('fs');
const { ROOT_PATH, OUTPUT_PATH } = require('../utils/constant-path');
const path = require('path');
const { convert } = require('image-to-pdf');
const Stats = require('../utils/stats');
const { exec } = require('child_process');

let gsStringAccordingToSystem = process.env.SYSTEM === 'mac' ? 
'gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="' :
 'gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="' 


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

        return this.compressPdfSize(outputPath);
    }

    static async compressPdfSize(pdfPath) {
        return new Promise((resolve, reject) => {
            const compressedPath = pdfPath.replace('.pdf', '_compressed.pdf');
            const gsCommand = `${gsStringAccordingToSystem}${compressedPath}" "${pdfPath}"`;

            exec(gsCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Ghostscript compression failed: ${error.message}`));
                    return;
                }

                fs.rename(compressedPath, pdfPath, (err) => {
                    if (err) {
                        reject(new Error(`Failed to overwrite with compressed PDF: ${err.message}`));
                    } else {
                        resolve(pdfPath);
                    }
                });
            });
        });
    }

    static async getFilesFromTargetFolders() {

        Stats.initializeResultFile();

        const folders = this.getTargetFolders();
        for (const folder of folders) {
            const folderPath = path.join(ROOT_PATH, folder);
            const files = fs.readdirSync(folderPath)
                .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
                .map(file => path.join(folderPath, file));

            let textClass = new Stats(folder, files.length);
            textClass.insertStatsInResultFile();

            await this.generatePdf(files, folder);
        }

    }

    static async generatePDFfromFolders(req, res, next) {
        try {
            await PdfController.getFilesFromTargetFolders();
            res.render("index", { message: "All folders converted successfully!" });
        } catch (error) {
            res.render('index', { message: error.message })
        }

    }
};