const express = require('express')
const { createSettlement } = require('../controllers/settlementController')

const router = express.Router()

router.post('/', createSettlement)

module.exports = router


