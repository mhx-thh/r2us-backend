const BlogModel = require('../models/blogModel');
const factory = require('../utils/handlerFactory');

exports.getAllBlogs = factory.getAll(BlogModel);
exports.getBlogBySlug = factory.getOne(BlogModel, { query: 'slug' });
exports.createBlog = factory.createOne(BlogModel);
exports.updateBlog = factory.updateOne(BlogModel);
exports.deleteBlog = factory.deleteOne(BlogModel);

exports.getNewBlogs = (req, res, next) => {
  req.query.__limit = '4';
  req.query.__sort = '-createdAt, -updatedAt';
  next();
};

exports.setUserCreateBlog = (request, response, next) => {
  request.body.createBy = request.user.id;
  return next();
};

exports.restrictUpdateBlogFields = (req, res, next) => {
  const allowed = ['blogTitle', 'content'];
  Object.keys(req.body).forEach((element) => {
    if (!allowed.includes(element)) {
      delete req.body[element];
    }
  });
  next();
};
