const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Pass to next layer of middleware
  next();
});

const users = [];

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send('<h1>Welcome!</h1>');
});

app.post('/users', (req, res) => {
  const index = users.findIndex((user) => user.name === req.body.name);

  if (users.length === 100) {
    res.json({
      message: 'Maximum create users limit exceeded',
    });
    return;
  }

  if (index !== -1) {
    res.json({
      message: 'User already exists. Please try different name!',
    });
    return;
  }

  if (req.body.name.trim() && req.body.age && req.body.age > 0) {
    const user = {
      id: randomIntFromInterval(1, 100),
      name: req.body.name,
      age: +req.body.age,
    };
    users.push(user);
    res.status(201).json(user);
  } else {
    res.json({
      message: 'Please create user with valid details!',
    });
  }
});

app.get('/users', (req, res) => {
  if (!users.length) {
    res.json({
      message: 'No users found',
    });
    return;
  }
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const userId = +req.params.id;
  if (!userId && userId !== 0) {
    res.json({
      message: 'Enter valid user ID',
    });
    return;
  }
  if (userId >= 1 && userId <= 100) {
    const user = users.find((user) => user.id === userId);
    if (!user) {
      res.status(404).json({
        message: "Couldn't find user with given ID",
      });
      return;
    }
    res.json(user);
  } else {
    res.json({
      message: 'User ID should be in between 1 and 100',
    });
  }
});

app.put('/users/:id', (req, res) => {
  const userId = +req.params.id;
  if (!userId && userId !== 0) {
    res.json({
      message: 'Enter valid user ID',
    });
    return;
  }
  if (userId >= 1 && userId <= 100) {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      if (req.body.name) {
        const isUserExistsWithSameName = users.findIndex(
          (user) => user.name === req.body.name
        );

        if (
          users[userIndex]['name'] !== req.body.name &&
          isUserExistsWithSameName !== -1
        ) {
          res.json({
            message: 'User already exists. Please try different name!',
          });
          return;
        }
        if (users[userIndex]['name'] === req.body.name) {
          res.json({
            message: 'New name is same as old name',
          });
          return;
        }
      }
      const user = users[userIndex];
      const keys = Object.keys(req.body);
      if (keys.length !== 0) {
        keys.forEach((key) => {
          user[key] = req.body[key];
        });
      }
      users[userIndex] = user;
      res.json(users[userIndex]);
    } else {
      res.status(404).json({
        message: "Couldn't find user with given ID",
      });
    }
  }
});

app.delete('/users/:id', (req, res) => {
  const userId = +req.params.id;
  if (!userId && userId !== 0) {
    res.json({
      message: 'Enter valid user ID',
    });
    return;
  }
  if (userId >= 1 && userId <= 100) {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex < 0) {
      res.status(404).json({
        message: "Couldn't find user with given ID",
      });
    }
    users.splice(userIndex, 1);
    res.send(204);
  } else {
    res.json({
      message: 'User ID should be in between 1 and 100',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
}
