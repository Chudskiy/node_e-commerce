const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
    const {name, picture, email} = req.user;

    const user = await User.findOneAndUpdate(
        {email},
        {name: email.split('@')[0], picture},
        {new: true}
    );

    // console.log('user in controller = ', user)

    if (user) {
        res.json(user);
    } else {
        console.log('USER UPDATED = ', user)
        const newUser = await new User({
            name: email.split('@')[0],
            // name: email.split('@')[0],
            email,
            picture,
        }).save();
        console.log('USER CREATED = ', newUser);
        res.json(newUser);
    }
}

exports.currentUser = async (req, res) => {
    User.findOne({email: req.user.email}).exec((err, user) => {
        if (err) throw new Error(err);
        res.json(user);
    })
}

