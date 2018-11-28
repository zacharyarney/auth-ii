require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./data/dbConfig');

const server = express();

server.use(express.json());
server.use(cors());

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.department,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 11);

  creds.password = hash;

  db('users')
    .insert(creds)
    .then((id) => {
      res.status(201).json(id);
    })
    .catch((err) =>
      res.status(500).json({ message: 'could not register user', err })
    );
});

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        // response sends token manually
        res.status(200).json({ message: 'welcome!', token });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch((err) => res.json(err));
});

server.get('/', (req, res) => {
  res.json({ message: 'Its Alive!' });
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
