const { STATS_PATH } = require("./constant-path");
const fs = require('fs');

module.exports = class Stats {
    constructor(folderName = 'Unknown Folder', itemsLength = 0) {
        this.folderName = folderName;
        this.itemsLength = itemsLength;
    }

    static initializeResultFile() {
        let timeString = new Date().toISOString();
        Stats.safeAppendToFile(`\n${timeString}\n\n`);
    }

    insertStatsInResultFile() {
        const logEntry = `${this.folderName} : Total Pages ${this.itemsLength}\n`;
        Stats.safeAppendToFile(logEntry);
    }

    static safeAppendToFile(data) {
        try {
            fs.appendFileSync(STATS_PATH, data);
        } catch (err) {
            console.error("Error writing to file:", err);
        }
    }
}
