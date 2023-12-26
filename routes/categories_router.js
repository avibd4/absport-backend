const router = require("express").Router();
const auth_manager = require('../middlewares/auth_manager');

const upload = require('../middlewares/upload');
// managers functions 

const {

    getAllCategoriesForManagers,
    getCategoryByIdForManagers,
    addNewCategoryForManagers,
    deleteCategoryByIdForManagers,
    updateCategoryByIdForManagers,
    getAllCategories

} = require ('../controllers/categories_controller');

// ___________________




// managers requests


router.get('/managers/all',getAllCategoriesForManagers)
router.get('/managers/get-by-id/:id',getCategoryByIdForManagers)
router.post('/managers/add-category',upload.single('category_image'), addNewCategoryForManagers)
router.delete('/managers/delete-category/:id',deleteCategoryByIdForManagers)
router.put('/managers/update-category/:id',upload.single('category_image'),updateCategoryByIdForManagers)

// managers requests

// customers requests

router.get('/all',getAllCategories)

// __________________


module.exports = router;
