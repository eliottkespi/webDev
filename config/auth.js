module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('errorMsg', 'Permission Denied - Please Login');
            res.redirect('/users/login');
        }
    }
};