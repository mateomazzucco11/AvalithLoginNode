const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

const { users } = require('./user');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', async (req, res) => {
    const { user, password } = req.body;

    (!user || !password) ? res.status(401).send() : res.status(200);

    const userExists = users.find((userTry) => userTry.user === user);
    try {
        if (await bcrypt.compare(password, userExists.password)) {
            const token = jwt.sign(userExists, process.env.ACCESS_TOKEN);
            userExists.token = token;

            res.status(200).json({
                message: 'Welcome',
                token
            })
        } else {
            res.status(403).send('Invalid')
        }
    }
    catch {
        res.status(500).send()
    }
})

function verifyToken(req, res, next) {
    const token = req.headers['token'];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        (err) ? res.send(403) : req.user = user;
        next();
    })
}

app.get('/grettings', verifyToken, (req, res) => {
    res.json({
        mensaje: `Buenos dias ${req.users.user}`
    })
})

app.listen(PORT, () => {
    console.log(`Abrir en http://localhost:${PORT}`)
})
