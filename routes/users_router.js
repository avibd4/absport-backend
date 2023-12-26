const router = require("express").Router();


// auth middlewares
const auth_manager = require('../middlewares/auth_manager');
const auth_admin = require('../middlewares/auth_admin');


// functions from managers controllers
const {
    loginManager,
    logoutManager,
    authManager,
    addManagerForAdmins,
    getAllManagersForAdmin,
    getById,
    updateManagerById,
    deleteManagerById
} = require('../controllers/managers_controller');


// function from users controller
const {
    getAllCustomersForManager,
    getCustomerByIdForManager,
    deleteUserByIdForManager,
    updateUserByIdForManager,
    addUserForManager,
    registerForCustomers,
    login,
    logout,
    updateById,
    authToken,
    // registerConfirmMail    
} = require('../controllers/users_controller');
const auth_user = require("../middlewares/auth_user");


// admins request
router.post('/admins/add-manager', auth_admin, addManagerForAdmins);
router.get('/admins/get-all-managers',auth_admin, getAllManagersForAdmin)
router.put('/admin/update-manager/:manager_id', auth_admin, updateManagerById)
router.delete('/admins/delete-manager/:manager_id', auth_admin, deleteManagerById)


// managers requests
router.post('/managers/login', loginManager);
router.post('/managers/logout', logoutManager);
router.get('/managers/auth', authManager);
router.post('/add-user-for-managers', auth_manager, addUserForManager);
router.get('/customers-for-managers', auth_manager,  getAllCustomersForManager);
router.get('/customer-by-id-for-manager/:user_id',  getCustomerByIdForManager);
router.delete('/delete-user-for-managers/:user_id',auth_manager,  deleteUserByIdForManager);
router.put('/update-user-for-managers/:user_id',auth_manager,  updateUserByIdForManager);

// customers requests
router.post('/customer/register', registerForCustomers)
router.put('/customer/update-by-id/:id', auth_user, updateById)
router.post('/customer/login', login);
router.get('/customer/auth', authToken)
// router.post('/login/send-confirm-mail/:mail', registerConfirmMail)
// __________________

module.exports = router;
