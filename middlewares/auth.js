const admin = require('../firebase');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
    try {
        const firebaseUser = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken);
        // console.log('FIREBASE USER IN AUTHCHECK = ', firebaseUser);
        req.user = firebaseUser;
        next();

    } catch (error) {
        res.status(400).json({
            error: 'Invalid or expired token'
        })
    }
}

exports.adminCheck = async (req, res, next) => {
    const {user} = req.user;

    const adminUser = await User.findOne({user});

    if (adminUser.role !== 'admin') {
        res.status(403).json({err: 'Admin resource. Access denied.',
        });
    } else {
        next();
    }
}

