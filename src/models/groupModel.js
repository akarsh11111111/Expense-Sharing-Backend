const { v4: uuid } = require('uuid')

class Group {
  constructor ({ id = uuid(), name, memberIds = [], balances = {} }) {
    this.id = id
    this.name = name
    this.memberIds = memberIds // array of userIds
    this.balances = balances // userId -> net amount (positive means others owe this user)
  }
}

class GroupStore {
  constructor () {
    this.groups = new Map()
  }

  createGroup (payload) {
    // Initialize all provided member balances to zero
    const balances = {}
    ;(payload.memberIds || []).forEach(id => {
      balances[id] = 0
    })

    const group = new Group({ ...payload, balances })
    this.groups.set(group.id, group)
    return group
  }

  getGroup (id) {
    return this.groups.get(id) || null
  }

  getAllGroups () {
    return Array.from(this.groups.values())
  }

  addMember (groupId, userId) {
    const group = this.getGroup(groupId)
    if (!group) return null
    if (!group.memberIds.includes(userId)) {
      group.memberIds.push(userId)
      group.balances[userId] = group.balances[userId] || 0
    }
    return group
  }
}

const groupStore = new GroupStore()

module.exports = {
  Group,
  groupStore
}


