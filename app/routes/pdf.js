const PdfController = require('../controllers/pdf')
const router = require('express').Router()

router.post('/convert',PdfController.generatePDFfromFolders)

module.exports = router