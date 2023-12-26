const controler_name = "serviceCall";
const object_name = "ServiceCall";
const objects_name = "serviceCalls";

const jwt = require('jsonwebtoken');
const User = require('../models/User');


const Model = require(`../models/${object_name}`);

module.exports ={

    getAllCallsForManagers:async(req, res) => {
        try {
            const models = await Model.find().exec();

            return res.status(200).json({
                success:true,
                message:`success to find all ${objects_name} - for managers`,
                [objects_name]:models
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in get all ${objects_name} - for -managers`,
                error: error.message
            })
        }
    },
    sendNewCall:async(req, res) => {
        try {
      // getting values from the body request
            const {
                user_id,
                name,
                email,
                message
            } = req.body;

     // creating new model using the values from req.body
            const new_model = new Model({
                user: user_id,
                name,
                email,
                message
            });
     // actual saving
            await new_model.save();


     // getting values from the new user

            const userCalls = await Model.find({email});
            const lastCall = userCalls[userCalls.length-1]
    // return success message
    return res.status(200).json({
        success:true,
        message:`success to send new ${controler_name} - for user`,
        serviceCall: lastCall
        })   
            
    } catch (error) {
            return res.status(500).json({
                message:`error in send ${controler_name} - for user`,
                error: error.message
            })
            
        }
    },
    getAllCallsForCustomer:async(req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const userId = req.params.userId;
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            if(decode.user !== userId){
                throw new error('unauthorized access!')
            }
            
            const models = await Model.find({user:userId}).exec();
            modelsWithoutMangerNote = models.map((call)=>{
                return ({...call._doc, manager_note: ""})
            })

            return res.status(200).json({
                success:true,
                message:`success to find all ${objects_name} - for user`,
                [objects_name]:modelsWithoutMangerNote
            })            
        } catch (error) {
            return res.status(500).json({
                message:`error in get all ${objects_name} - for -user`,
                error: error.message
            })
        }
    },
    updateServiceCallForManagers:async(req, res) => {
        try {
            const id = req.params.id_call;

            await Model.findByIdAndUpdate(id, req.body).exec();

            return res.status(200).json({
                success:true,
                message:`success to update ${controler_name} status by id - for managers`
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in update ${controler_name} status by id - for managers`,
                error: error.message
            })
        }
    },
    deleteServiceCallByIdForManagers : async (req,res)=> {
        try {
            const id = req.params.id_call;

            await Model.findByIdAndDelete(id).exec();

            return res.status(200).json({
                success:true,
                message:`success to delete ${controler_name} by id - for managers`
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in delete ${controler_name} by id - for managers`,
                error: error.message
            })
        }
    },
    sendMessageToCustomerForManager: async(req, res) =>{
        try {
            const id = req.params.id_call;

            await Model.findByIdAndUpdate(id, {manager_note:req.body.message} ).exec();

            return res.status(200).json({
                success:true,
                message:`success to send message to customer - for managers`
            })
        } catch (error) {
            return res.status(500).json({
                message:`error in send message to customer - for managers`,
                error: error.message
            })
        }
    }

}