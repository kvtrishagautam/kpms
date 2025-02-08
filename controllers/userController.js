const userController = {
    getDashboard: (req, res) => {
        res.render('dashboard', {
            user: req.session.user
        });
    },

    getProfile: (req, res) => {
        res.render('profile', {
            user: req.session.user
        });
    },

    // Add more user-related controllers as needed
};

module.exports = userController;