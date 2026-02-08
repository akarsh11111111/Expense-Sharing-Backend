const Joi = require('joi')
const { settlementStore } = require('../models/settlementModel')
const { groupStore } = require('../models/groupModel')
const { userStore } = require('../models/userModel')
const { applySettlementToBalances } = require('../services/balanceService')

const createSettlementSchema = Joi.object({
  groupId: Joi.string().required(),
  fromUserId: Joi.string().required(),
  toUserId: Joi.string().required(),
  amount: Joi.number().positive().required()
})

const createSettlement = (req, res, next) => {
  try {
    const { error, value } = createSettlementSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }

    const group = groupStore.getGroup(value.groupId)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const fromUser = userStore.getUser(value.fromUserId)
    const toUser = userStore.getUser(value.toUserId)
    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'Users involved in settlement must exist' })//404 bheg diya
    }

    if (!group.memberIds.includes(value.fromUserId) || !group.memberIds.includes(value.toUserId)) {//dobno user group mem hona chahiye 
      return res.status(400).json({ message: 'Both users must be members of the group' })
    }

    const settlement = settlementStore.createSettlement(value)
    applySettlementToBalances(value.groupId, settlement)
    res.status(201).json(settlement)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createSettlement
}


