const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        console.log('req.body = ', req.body);

        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);

    } catch (err) {
        console.log('err = ', err);
        // res.status(400).send('Product create failed');
        res.status(400).json({
            err: err.message,
        })
    }
};

exports.listAll = async (req, res) => {
    const products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec();
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    } catch (err) {
        console.log('err = ', err);
        return res.status(400).send('Product delete failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({slug: req.params.slug})
        .populate('category')
        .populate('subs')
        .exec();
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updated = await Product.findOneAndUpdate(
            {slug: req.params.slug},
            req.body,
            {new: true},
        ).exec();

        res.json(updated);
    } catch (err) {
        console.log('PRODUCT UPDATE ERROR = ', err);
        // return res.status(400).send('Product update failed');
        res.status(400).json({
            err: err.message,
        })
    }
};

// without pagination
// exports.list = async (req, res) => {
//     try {
//         // createdAt/updatedAt desc/asc, 3
//         const {sort, order, limit} = req.body;
//         const products = await Product.find({})
//             .populate('category')
//             .populate('subs')
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec();
//
//         res.json(products);
//     } catch (err) {
//         console.log('err = ', err);
//     }
// };

//with pagination
exports.list = async (req, res) => {
    try {
        // createdAt/updatedAt desc/asc, 3
        const {sort, order, page} = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        res.json(products);
    } catch (err) {
        console.log('err = ', err);
    }
};

exports.productsCount = async (req, res) => {
    const total = await Product.find({})
        .estimatedDocumentCount()
        .exec();

    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.product._id).exec();
    const user = await User.findOne({email: req.user.email}).exec();
    const {star} = req.body;

    const existingRatingObject = product.ratings.find(
        elem => elem.postedBy.toString() === user._id.toString()
    );

    if (existingRatingObject === undefined) {
        const ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: {
                    ratings: {star, postedBy: user._id}
                }
            },
            {new: true},
        ).exec();
        console.log('rating added = ', ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne({
                ratings: {$elemMatch: existingRatingObject}
            },
            {$set: {'ratings.$.star': star}},
            {new: true},
        ).exec();
        console.log('rating updated = ', ratingUpdated);

        res.json(ratingUpdated)
    }

}




