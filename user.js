const bcrypt = require('bcrypt');

const users = [
    {
        user: 'Admin',
        password: bcrypt.hashSync('Admin', 10),
    }
]

module.exports = { users }