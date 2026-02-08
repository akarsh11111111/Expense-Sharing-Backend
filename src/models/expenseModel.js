const { v4: uuid } = require('uuid')

// Supported split types
const SPLIT_TYPES = {
  EQUAL: 'EQUAL',
  EXACT: 'EXACT',
  PERCENT: 'PERCENT'
}

class Expense {
  constructor ({
    id = uuid(),
    groupId,
    paidBy, // userId
    amount,
    splitType,
    splits, // [{ userId, amount? , percent? }]
    description = '',
    createdAt = new Date()
  }) {
    this.id = id
    this.groupId = groupId
    this.paidBy = paidBy
    this.amount = amount
    this.splitType = splitType
    this.splits = splits
    this.description = description
    this.createdAt = createdAt
  }
}

class ExpenseStore {
  constructor () {
    this.expenses = new Map()
  }

  createExpense (payload) {
    const expense = new Expense(payload)
    this.expenses.set(expense.id, expense)
    return expense
  }

  getExpense (id) {
    return this.expenses.get(id) || null
  }

  getExpensesByGroup (groupId) {
    return Array.from(this.expenses.values()).filter(e => e.groupId === groupId)
  }

  getAllExpenses () {
    return Array.from(this.expenses.values())
  }
}

const expenseStore = new ExpenseStore()

module.exports = {
  SPLIT_TYPES,
  Expense,
  expenseStore
}


