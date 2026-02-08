const { v4: uuid } = require('uuid')

class Settlement {
  constructor ({
    id = uuid(),
    groupId,
    fromUserId,
    toUserId,
    amount,
    createdAt = new Date()
  }) {
    this.id = id
    this.groupId = groupId
    this.fromUserId = fromUserId
    this.toUserId = toUserId
    this.amount = amount
    this.createdAt = createdAt
  }
}

class SettlementStore {
  constructor () {
    this.settlements = new Map()
  }

  createSettlement (payload) {
    const settlement = new Settlement(payload)
    this.settlements.set(settlement.id, settlement)
    return settlement
  }

  getSettlementsByGroup (groupId) {
    return Array.from(this.settlements.values()).filter(s => s.groupId === groupId)
  }

  getAllSettlements () {
    return Array.from(this.settlements.values())
  }
}

const settlementStore = new SettlementStore()

module.exports = {
  Settlement,
  settlementStore
}


