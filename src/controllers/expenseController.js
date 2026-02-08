const Joi = require('joi')
const { SPLIT_TYPES, expenseStore } = require('../models/expenseModel')
const { groupStore } = require('../models/groupModel')
const { userStore } = require('../models/userModel')
const { applyExpenseToBalances } = require('../services/balanceService')

const splitSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive(),
  percent: Joi.number().min(0).max(100)
})

const createExpenseSchema = Joi.object({
  groupId: Joi.string().required(),
  paidBy: Joi.string().required(),
  amount: Joi.number().positive().required(),
  splitType: Joi.string().valid(SPLIT_TYPES.EQUAL, SPLIT_TYPES.EXACT, SPLIT_TYPES.PERCENT).required(),
  splits: Joi.array().items(splitSchema).min(1).required(),
  description: Joi.string().allow('').default('')
})

const validateBusinessRules = (payload) => {
  const group = groupStore.getGroup(payload.groupId)
  if (!group) {
    const err = new Error('Group not found')
    err.status = 404
    throw err
  }

  if (!group.memberIds.includes(payload.paidBy)) {
    const err = new Error('Payer must be a member of the group')
    err.status = 400
    throw err
  }

  payload.splits.forEach(s => {
    if (!group.memberIds.includes(s.userId)) {
      const err = new Error('All split users must belong to the group')
      err.status = 400
      throw err
    }
    if (!userStore.getUser(s.userId)) {
      const err = new Error('Split user not found')
      err.status = 404
      throw err
    }
  })

  if (!userStore.getUser(payload.paidBy)) {
    const err = new Error('Payer user not found')
    err.status = 404
    throw err
  }

  if (payload.splitType === SPLIT_TYPES.EXACT) {
    const total = payload.splits.reduce((sum, s) => sum + (s.amount || 0), 0)
    if (Math.abs(total - payload.amount) > 0.01) {
      const err = new Error('Sum of exact amounts must equal total amount')
      err.status = 400
      throw err
    }
  } else if (payload.splitType === SPLIT_TYPES.PERCENT) {
    const totalPercent = payload.splits.reduce((sum, s) => sum + (s.percent || 0), 0)
    if (Math.abs(totalPercent - 100) > 0.01) {
      const err = new Error('Sum of split percentages must be 100')
      err.status = 400
      throw err
    }
  }
}

const createExpense = (req, res, next) => {
  try {
    const { error, value } = createExpenseSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }

    validateBusinessRules(value)

    const expense = expenseStore.createExpense(value)
    applyExpenseToBalances(value.groupId, expense)
    res.status(201).json(expense)
  } catch (err) {
    next(err)
  }
}

const listGroupExpenses = (req, res, next) => {
  try {
    const groupId = req.params.groupId
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const expenses = expenseStore.getExpensesByGroup(groupId)
    res.json(expenses)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createExpense,
  listGroupExpenses
}


