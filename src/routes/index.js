const express = require('express')
const userRoutes = require('./userRoutes')
const groupRoutes = require('./groupRoutes')
const expenseRoutes = require('./expenseRoutes')
const settlementRoutes = require('./settlementRoutes')

const router = express.Router()

router.use('/users', userRoutes)
router.use('/groups', groupRoutes)
router.use('/expenses', expenseRoutes)
router.use('/settlements', settlementRoutes)

module.exports = router


