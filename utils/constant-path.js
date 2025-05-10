const path = require('path');

const ROOT_PATH = path.join(__dirname ,'../', process.env.ROOT_PATH )
const OUTPUT_PATH = path.join(__dirname ,'../',process.env.OUTPUT_PATH )

module.exports = {
    ROOT_PATH,
    OUTPUT_PATH
}