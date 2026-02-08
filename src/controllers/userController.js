const Joi = require('joi')
const { userStore } = require('../models/userModel')

const createUserSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required()
})

const createUser = (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const user = userStore.createUser(value)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

const listUsers = (req, res) => {
  const users = userStore.getAllUsers()
  res.json(users)
}

module.exports = {
  createUser,
  listUsers
}


