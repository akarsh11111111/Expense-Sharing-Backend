const express = require('express')
const {
  createGroup,
  listGroups,
  addMemberToGroup,
  getGroupBalances,
  getGroupBalancesRaw,
  reconcileBalances,
  getUserBalanceInGroup
} = require('../controllers/groupController')

const router = express.Router()

router.post('/', createGroup)
router.get('/', listGroups)
router.post('/:groupId/members', addMemberToGroup)
router.get('/:groupId/balances', getGroupBalances)
router.get('/:groupId/balances/raw', getGroupBalancesRaw)
router.post('/:groupId/balances/reconcile', reconcileBalances)
router.get('/:groupId/users/:userId/balance', getUserBalanceInGroup)

module.exports = router


