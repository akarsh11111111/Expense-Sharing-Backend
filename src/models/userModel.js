const { v4: uuid } = require('uuid')

class User {
  constructor ({ id = uuid(), name, email }) {
    this.id = id
    this.name = name
    this.email = email
  }
}

// In-memory user store
class UserStore {
  constructor () {
    this.users = new Map()
  }

  createUser (payload) {
    const user = new User(payload)
    this.users.set(user.id, user)
    return user
  }

  getUser (id) {
    return this.users.get(id) || null
  }

  getAllUsers () {
    return Array.from(this.users.values())
  }
}

const userStore = new UserStore()

// Example seed user 
userStore.createUser({ name: 'adarsh_shukla', email: 'adarsh_shukla@gmail.com' })

module.exports = {
  User,
  userStore
}


