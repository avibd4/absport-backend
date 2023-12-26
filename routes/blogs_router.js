const router = require("express").Router();

// auth
const auth_manager = require('../middlewares/auth_manager');
const upload = require('../middlewares/upload');
const {
   addBlogForManager,
   getAllBlogsForManager,
   getBlogByIdForManager,
   updateBlogByIdForManager,
   deleteBlogByIdForManager
} = require ('../controllers/blogs_controller');

// managers requests
router.get('/managers/all', auth_manager, getAllBlogsForManager);
router.get('/managers/by_id/:blog_id', auth_manager, getBlogByIdForManager);
router.post('/managers/add',upload.single('blog_title_image'), auth_manager, addBlogForManager);
router.put('/managers/update/:blog_id', upload.single('blog_title_image'), auth_manager, updateBlogByIdForManager);
router.delete('/managers/delete/:blog_id', auth_manager, deleteBlogByIdForManager);

// customers requests
router.get('/customers/all', getAllBlogsForManager);
router.get('/customers/by_id/:blog_id', getBlogByIdForManager);

module.exports = router;

