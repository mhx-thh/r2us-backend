const express = require('express');
const authCtrl = require('../controller/authCtrl');
const blogCtrl = require('../controller/blogCtrl');
const { convVieSearch } = require('../controller/middleCtrl');

const router = express.Router();

router.route('/new-blogs').get(blogCtrl.getNewBlogs, blogCtrl.getAllBlogs);
router.get('/', convVieSearch, blogCtrl.getAllBlogs);
router.get('/:slug', blogCtrl.getBlogBySlug);

// User can create class
router.use(authCtrl.protect, authCtrl.restrictTo('admin'));
router.route('/')
  .post(
    blogCtrl.setUserCreateBlog,
    blogCtrl.createBlog,
  );

// Provider can update class
router.route('/:id')
  .patch(
    blogCtrl.restrictUpdateBlogFields,
    blogCtrl.updateBlog,
  )
  .delete(
    blogCtrl.deleteBlog,
  );

module.exports = router;
