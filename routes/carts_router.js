const router = require("express").Router();
const auth_user = require('../middlewares/auth_user');


const {
    add,
    getAll,
    getById,
    updateById,
    deleteById,


} = require ('../controllers/carts_controller');


//router.get('', getAll)
router.get('/get-cart-by-id/:id', auth_user, getById)
//router.post('/add', add)
router.put('/update-cart-by-id/:id',auth_user, updateById)
//router.delete('', deleteById)

module.exports = router;
