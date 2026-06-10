const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mbeya-food-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

function sanitize(value) {
  return String(value || '').trim();
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function isValidPhone(phone) {
  return /^(\+255|0)[0-9]{8,12}$/.test(phone);
}

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  res.render('index', {
    userName: req.session.userName || null
  });
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }

  res.render('login', {
    activeTab: 'login',
    errors: [],
    success: '',
    loginEmail: '',
    registerName: '',
    registerEmail: '',
    registerPhone: '',
    registerAddress: ''
  });
});

app.get('/login.php', (req, res) => {
  res.redirect('/login');
});

app.get('/index.php', (req, res) => {
  res.redirect('/');
});

app.get('/logout.php', (req, res) => {
  res.redirect('/logout');
});

app.post('/login', async (req, res) => {
  const formType = req.body.form_type || '';
  const errors = [];
  let activeTab = 'login';
  let success = '';

  const loginEmail = sanitize(req.body.login_email || '');
  const registerName = sanitize(req.body.register_name || '');
  const registerEmail = sanitize(req.body.register_email || '');
  const registerPhone = sanitize(req.body.register_phone || '');
  const registerAddress = sanitize(req.body.register_address || '');

  if (formType === 'login') {
    const email = sanitize(req.body.login_email || '').toLowerCase();
    const password = req.body.login_password || '';

    if (!email) {
      errors.push('Please enter a valid email address.');
    }
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    if (errors.length === 0) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && bcrypt.compareSync(password, user.passwordHash)) {
        req.session.userId = user.id;
        req.session.userName = user.fullName;
        req.session.userEmail = user.email;
        return res.redirect('/');
      }
      errors.push('Invalid email or password.');
    }
  }

  if (formType === 'register') {
    activeTab = 'register';
    const fullName = sanitize(req.body.register_name || '');
    const email = sanitize(req.body.register_email || '').toLowerCase();
    const phone = sanitize(req.body.register_phone || '');
    const address = sanitize(req.body.register_address || '');
    const password = req.body.register_password || '';
    const confirmPassword = req.body.register_confirm_password || '';

    if (!fullName) {
      errors.push('Full name is required.');
    }
    if (!email) {
      errors.push('Please enter a valid email address.');
    }
    if (!phone) {
      errors.push('Phone number is required.');
    }
    if (!address) {
      errors.push('Address is required.');
    }
    if (!password) {
      errors.push('Password is required.');
    }
    if (!confirmPassword) {
      errors.push('Please confirm your password.');
    }

    if (password && password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (password && !isValidPassword(password)) {
      errors.push('Password must include uppercase, lowercase, a number, and a special character.');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }
    if (phone && !isValidPhone(phone)) {
      errors.push('Please enter a valid Tanzanian phone number.');
    }

    if (errors.length === 0) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        errors.push('This email is already registered.');
      }
    }

    if (errors.length === 0) {
      const passwordHash = bcrypt.hashSync(password, 10);
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          address,
          passwordHash
        }
      });

      req.session.userId = user.id;
      req.session.userName = user.fullName;
      req.session.userEmail = user.email;
      return res.redirect('/');
    }
  }

  return res.render('login', {
    activeTab,
    errors,
    success,
    loginEmail,
    registerName,
    registerEmail,
    registerPhone,
    registerAddress
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
