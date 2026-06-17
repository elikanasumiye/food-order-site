const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('index', {
    userName: null
  });
});

app.get('/login', (req, res) => {
  res.redirect('/');
});

app.get('/login.php', (req, res) => {
  res.redirect('/');
});

app.get('/index.php', (req, res) => {
  res.redirect('/');
});

app.get('/logout.php', (req, res) => {
  res.redirect('/logout');
});

app.post('/login', (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.listen(port, async () => {
  console.log(`Server inaendesha hapa: http://localhost:${port}`);
});
