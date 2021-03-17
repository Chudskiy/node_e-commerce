const Category = require('../models/category');
const Sub = require('../models/sub');
const slugify = require("slugify");


exports.create = async (req, res) => {
    try {
        const {name} = req.body;

        const category = await new Category({
            name,
            slug: slugify(name)
        }).save();
        res.json(category);

    } catch (err) {
        res.status(400).send('Create category failed');
    }
};

exports.list = async (req, res) => {
    res.json(await Category.find({}).sort({createdAt: -1}).exec());
};

exports.read = async (req, res) => {
    const category = await Category.findOne({slug: req.params.slug}).exec();
    res.json(category);
};

exports.update = async (req, res) => {
    try {
        const {name} = req.body;
        const updated = await Category.findOneAndUpdate(
            {slug: req.params.slug},
            {name, slug: slugify(name)},
            {new: true},
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json('Update category failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({slug: req.params.slug});
        res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete category failed');
    }
};

exports.getSubs = async (req, res) => {
    console.log('req.data = ', req.params._id);
    await Sub.find({parent: req.params._id}).exec((err, subs) => {
        if (err) console.log('err = ', err);
        console.log('res = ', subs);
        res.json(subs);
    })
};


