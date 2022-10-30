const isLogin = (req, res, next) => {
  if (req.session.user === null || req.session.user === undefined) {
    req.flash('status', 'danger');
    req.flash('message', 'Session was expired.');
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = isLogin