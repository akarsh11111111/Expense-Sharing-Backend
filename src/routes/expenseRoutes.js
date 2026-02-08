const express = require('express')
const { createExpense, listGroupExpenses } = require('../controllers/expenseController')

const router = express.Router()

router.post('/', createExpense)
router.get('/group/:groupId', listGroupExpenses)

module.exports = router


