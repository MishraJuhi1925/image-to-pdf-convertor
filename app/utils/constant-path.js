const path = require('path');

const ROOT_PATH = path.join(__dirname ,'../', process.env.ROOT_PATH )
const OUTPUT_PATH = path.join(__dirname ,'../',process.env.OUTPUT_PATH )
const STATS_PATH = path.join(__dirname,'../',process.env.STATS_PATH)

console.log( ROOT_PATH,
    OUTPUT_PATH,
    STATS_PATH)

module.exports = {
    ROOT_PATH,
    OUTPUT_PATH,
    STATS_PATH
}