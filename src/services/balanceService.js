const { SPLIT_TYPES } = require('../models/expenseModel')
const { expenseStore } = require('../models/expenseModel')
const { settlementStore } = require('../models/settlementModel')
const { groupStore } = require('../models/groupModel')

// Internal: compute per-expense contributions and debts
const computeExpenseImpacts = (expense) => {
  const { amount, splitType, splits, paidBy } = expense
  const contributions = {} // userId -> net contribution (paid - owed)

  const addContribution = (userId, delta) => {
    contributions[userId] = (contributions[userId] || 0) + delta
  }

  // Payer pays full amount
  addContribution(paidBy, amount)

  if (splitType === SPLIT_TYPES.EQUAL) {
    const share = amount / splits.length
    splits.forEach(s => {
      addContribution(s.userId, -share)
    })
  } else if (splitType === SPLIT_TYPES.EXACT) {
    splits.forEach(s => {
      addContribution(s.userId, -s.amount)
    })
  } else if (splitType === SPLIT_TYPES.PERCENT) {
    splits.forEach(s => {
      const userShare = (amount * s.percent) / 100
      addContribution(s.userId, -userShare)
    })
  }

  return contributions
}

const getGroupOrThrow = (groupId) => {
  const group = groupStore.getGroup(groupId)
  if (!group) {
    const err = new Error('Group not found')
    err.status = 404
    throw err
  }
  if (!group.balances) group.balances = {}
  return group
}

const applyExpenseToBalances = (groupId, expense) => {
  const group = getGroupOrThrow(groupId)
  const impacts = computeExpenseImpacts(expense)

  Object.entries(impacts).forEach(([userId, delta]) => {
    group.balances[userId] = (group.balances[userId] || 0) + delta
  })

  return group
}

const applySettlementToBalances = (groupId, settlement) => {
  const group = getGroupOrThrow(groupId)
  const { fromUserId, toUserId, amount } = settlement

  group.balances[fromUserId] = (group.balances[fromUserId] || 0) - amount
  group.balances[toUserId] = (group.balances[toUserId] || 0) + amount

  return group
}

// Simplify balances stored on group to minimal transfers
const simplifyBalances = (groupId) => {
  const group = getGroupOrThrow(groupId)
  const net = group.balances || {}

  const creditors = []
  const debtors = []

  Object.entries(net).forEach(([userId, value]) => {
    const rounded = Math.round(value * 100) / 100
    if (rounded > 0.0001) creditors.push({ userId, value: rounded })
    else if (rounded < -0.0001) debtors.push({ userId, value: -rounded })
  })

  const simplified = []
  let i = 0; let j = 0
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const settled = Math.min(debtor.value, creditor.value)

    simplified.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amount: Math.round(settled * 100) / 100
    })

    debtor.value -= settled
    creditor.value -= settled
    if (debtor.value <= 0.0001) i++
    if (creditor.value <= 0.0001) j++
  }

  return simplified
}

const getUserSummary = (groupId, userId) => {
  const simplified = simplifyBalances(groupId)
  let totalOwes = 0
  let totalOwed = 0
  const owes = []
  const owedBy = []

  simplified.forEach(entry => {
    if (entry.fromUserId === userId) {
      totalOwes += entry.amount
      owes.push(entry)
    } else if (entry.toUserId === userId) {
      totalOwed += entry.amount
      owedBy.push(entry)
    }
  })

  totalOwes = Math.round(totalOwes * 100) / 100
  totalOwed = Math.round(totalOwed * 100) / 100

  return {
    totalOwes,
    totalOwed,
    owes,
    owedBy
  }
}

// Rebuild balances from all expenses and settlements (useful for reconciliation)
const reconcileGroupBalances = (groupId) => {
  const group = getGroupOrThrow(groupId)
  const fresh = {}

  const add = (userId, delta) => {
    fresh[userId] = (fresh[userId] || 0) + delta
  }

  expenseStore.getExpensesByGroup(groupId).forEach(exp => {
    const impacts = computeExpenseImpacts(exp)
    Object.entries(impacts).forEach(([userId, delta]) => add(userId, delta))
  })

  settlementStore.getSettlementsByGroup(groupId).forEach(s => {
    add(s.fromUserId, -s.amount)
    add(s.toUserId, s.amount)
  })

  group.balances = fresh
  return group
}

module.exports = {
  applyExpenseToBalances,
  applySettlementToBalances,
  reconcileGroupBalances,
  simplifyBalances,
  getUserSummary
}


