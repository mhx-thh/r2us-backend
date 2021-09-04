const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const convVie = require('../utils/convVie');

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: [true, 'A Blog should have a name'],
    unique: true,
    trim: true,
  },
  blogTitleTextSearch: {
    type: String,
    select: false,
  },

  content: {
    type: String,
  },

  slug: {
    type: String,
    unique: [true, 'A blog should have a slug unique'],
  },

  createBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

}, {
  timestamps: true,
});

blogSchema.index({ slug: 1 });
blogSchema.index({ blogTitleTextSearch: 'text' });

blogSchema.plugin(uniqueValidator, {
  message: 'Error, {VALUE} is already taken',
});

blogSchema.pre('save', async function (next) {
  // make it bester
  this.blogTitleTextSearch = convVie(this.blogTitle).toLowerCase();
  this.slug = slugify(convVie(this.blogTitle), { lower: true });
  return next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createBy',
    select: '_id studentCardNumber givenName familyName email dateOfBirth photo',
  });
  next();
});

blogSchema.pre(/findOneAndUpdate|updateOne|update/, async function (next) {
  const docUpdate = this.getUpdate();
  if (!docUpdate) return next();
  const updateDocs = {};
  if (docUpdate.blogTitle) {
    updateDocs.blogTitleTextSearch = convVie(docUpdate.blogTitle).toLowerCase();
    updateDocs.slug = slugify(convVie(docUpdate.blogTitle), { lower: true });
  }
  // update
  this.findOneAndUpdate({}, updateDocs, { runValidators: true, context: 'query' });
  return next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
