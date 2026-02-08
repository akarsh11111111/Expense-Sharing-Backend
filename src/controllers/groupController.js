const Joi = require('joi')
const { groupStore } = require('../models/groupModel')
const { userStore } = require('../models/userModel')
const {
  simplifyBalances,
  getUserSummary,
  reconcileGroupBalances
} = require('../services/balanceService')

const createGroupSchema = Joi.object({
  name: Joi.string().min(1).required(),
  memberIds: Joi.array().items(Joi.string()).default([])
})

const addMemberSchema = Joi.object({
  userId: Joi.string().required()
})

const createGroup = (req, res, next) => {
  try {
    const { error, value } = createGroupSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }

    // Validate members
    const validMemberIds = value.memberIds.filter(id => userStore.getUser(id))
    const group = groupStore.createGroup({
      name: value.name,
      memberIds: validMemberIds
    })
    res.status(201).json(group)
  } catch (err) {
    next(err)
  }
}

const listGroups = (req, res) => {
  const groups = groupStore.getAllGroups()
  res.json(groups)
}

const addMemberToGroup = (req, res, next) => {
  try {
    const { error, value } = addMemberSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const groupId = req.params.groupId
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const user = userStore.getUser(value.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const updated = groupStore.addMember(groupId, value.userId)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

const getGroupBalances = (req, res, next) => {
  try {
    const groupId = req.params.groupId
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const balances = simplifyBalances(groupId)
    res.json(balances)
  } catch (err) {
    next(err)
  }
}

const getGroupBalancesRaw = (req, res, next) => {
  try {
    const groupId = req.params.groupId
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    res.json(group.balances || {})
  } catch (err) {
    next(err)
  }
}

const getUserBalanceInGroup = (req, res, next) => {
  try {
    const { groupId, userId } = req.params
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const user = userStore.getUser(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const summary = getUserSummary(groupId, userId)
    res.json(summary)
  } catch (err) {
    next(err)
  }
}

const reconcileBalances = (req, res, next) => {
  try {
    const { groupId } = req.params
    const group = groupStore.getGroup(groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const reconciled = reconcileGroupBalances(groupId)
    res.json({ balances: reconciled.balances, reconciled: true })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createGroup,
  listGroups,
  addMemberToGroup,
  getGroupBalances,
  getGroupBalancesRaw,
  getUserBalanceInGroup,
  reconcileBalances
}


