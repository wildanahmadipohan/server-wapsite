const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
  viewLogin: async (req, res) => {
    try {
      const alert = {
        status: req.flash('status'),
        message: req.flash('message')
      }

      if (req.session.user === null || req.session.user === undefined) {
        const data = {
          title: 'Login',
          alert
        }

        res.render('index', data);
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      // req.flash('status', 'danger');
      // req.flash('message', `${error.message}`);
      res.redirect('/');
    }
  },

  actionLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        req.flash('status', 'danger');
        req.flash('message', 'User does not exist');
        res.redirect('/');
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          req.flash('status', 'danger');
          req.flash('message', 'Password does not match.');
          res.redirect('/');
        } else {
          req.session.user = {
            id: user._id,
            username: user.username
          };

          res.redirect('/admin/dashboard');
        }
      }

    } catch (error) {
      res.redirect('/');
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
}