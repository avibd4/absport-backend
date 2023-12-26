const router = require("express").Router();
const auth_manager = require('../middlewares/auth_manager');
const auth_user = require('../middlewares/auth_user')

const {
    getAllCallsForManagers,
    updateServiceCallForManagers,
    deleteServiceCallByIdForManagers,
    sendMessageToCustomerForManager,
    sendNewCall,
    getAllCallsForCustomer
} = require('../controllers/service_call_controller')

router.get('/managers/all-calls', getAllCallsForManagers)
router.put('/managers/update-service-call/:id_call', updateServiceCallForManagers)
router.put('/managers/send-message-to-customer/:id_call', sendMessageToCustomerForManager)
router.delete('/managers/delete-call-by-id/:id_call', deleteServiceCallByIdForManagers)

router.post('/customers/send-new-call', sendNewCall)
router.get('/customers/all-calls-by-id/:userId', auth_user, getAllCallsForCustomer)

module.exports = router;
