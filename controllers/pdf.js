const fs = require('fs');
const { ROOT_PATH, OUTPUT_PATH } = require('../utils/constant-path');
const path = require('path');
const { convert } = require('image-to-pdf');
const Stats = require('../utils/stats');

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

    static compressPdfSize(pdfPath){

    }

    static generatePDFfromFolders() {
        this.getFilesFromTargetFolders();
    }
};
