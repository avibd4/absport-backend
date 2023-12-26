let controler_name = "cart";
let object_name = "Cart";
let objects_name = "carts";

let Model = require(`../models/${object_name}`);


module.exports = {

    add: async (req,res) => {

        try {

            // gettind values from the body request
            const {
                user,
                products
            } = req.body;
    

            if (!user || !products) {
                throw new Error('missing required feilds')
            }

            // creating new model using the values from req.body
            const new_model = new Model({
    
                user,
                products

            });

            // actual saving
            await new_model.save();

            // return success message
            return res.status(200).json({
                success:true,
                message:`success to add new ${controler_name}`
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in add ${controler_name}`,
                error: error.message
            })
        }


    },

    getAll: async (req,res) => {


        try {

            const models = await Model.find().populate(['user','products.product']).exec();

            return res.status(200).json({
                success:true,
                message:`success to find all ${objects_name}`,
                [objects_name]:models
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in get all ${objects_name}`,
                error: error.message
            })
        }
    },

    getById: async (req,res)=>{

        try {

            const models = await Model.findById(req.params.id).populate(['user','products.product']).exec();

            return res.status(200).json({
                success:true,
                message:`success to find ${controler_name} by id`,
                [objects_name]:models
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message:`error in find ${controler_name} by id}`,
                error: error.message
            })
        }
    },

    updateById: async (req,res) =>{
        try {
            const id = req.params.id;

            await Model.findByIdAndUpdate(id,req.body).exec();

            return res.status(200).json({
                success:true,
                message:`success to update ${controler_name} by id`
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in update ${controler_name} by id`,
                error: error.message
            })
        }
    },

    deleteById : async (req,res)=> {


        try {


            const id = req.params.id;

            await Model.findByIdAndDelete(id).exec();

            return res.status(200).json({
                success:true,
                message:`success to delete ${controler_name} by id`
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in delete ${controler_name} by id`,
                error: error.message
            })
        }
    }
}