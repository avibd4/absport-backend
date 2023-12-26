const controler_name = "order";
const object_name = "Order";
const objects_name = "orders";

const Model = require(`../models/${object_name}`);
const Product = require('../models/Product')
const nodemailer = require("nodemailer")



module.exports = {

    // managers functions

    getAllOrdersForManagers: async (req,res) => {

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

    updateStatusForManagers: async (req,res) =>{


        try {


            const id = req.params.id;

            await Model.findByIdAndUpdate(id,{status:req.body.status}).exec();

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

    getOrderByIdForManagers: async (req,res)=>{

        try {

            const models = await Model.findById(req.params.id).populate([/* 'user', */'products.product']).exec();

            return res.status(200).json({
                success:true,
                message:`success to find ${controler_name} by id - for managers`,
                [controler_name]:models
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in find ${controler_name} by id} - for managers`,
                error: error.message
            })
        }
    },
    deleteOrderByIdForManagers : async (req,res)=> {


        try {


            const id = req.params.id;

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

    //___________________


    // guests functions

    addNewOrderForGuest: async (req,res) => {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
              user: process.env.MAIL,
              pass: process.env.MAIL_SECRET
            },
          })
        try {
           console.log(req.body)
            // gettind values from the body request
            const {

                payment_details,
                products,
                customer_details,
                user

            } = req.body;

            const orderDetails = user? {
                payment_details,
                products,
                customer_details,
                user
            } : {
                payment_details,
                products,
                customer_details
            }    

            // creating new model using the values from req.body
            const new_model = new Model(orderDetails);

            // actual saving
            await new_model.save();

                
            const customerOrders = await Model.find({customer_details:customer_details}).populate(['products.product'])
            const lastOrder = customerOrders[customerOrders.length-1]

            // const lastOrderFullProducts = lastOrder.products.map(async(product)=>{
            //     const fullProduct = await Product.findById(product.product)
            //     console.log(fullProduct)
            //     return ({...product})
            //     //return ({...product, product_name:fullProduct.product_name, product_price:fullProduct.product_price, product_image: fullProduct.product_image})
            // })
            // console.log('lasttt',lastOrderFullProducts)
            const orderTable = products.map((product)=>{
                return(                    
                    `<tr>
                        <td>
                            <img src=`+product.product_image+` width="100"/>
                        </td>
                        <td>`
                           + product.product_name+
                        `</td>
                        <td>$`
                            +product.RTP+
                        `</td>
                        <td>`
                            +product.quantity+
                        `</td>
                        <td>$`
                        +product.quantity*product.RTP+
                        `</td>
                    </tr>`
                )
            })
            const total_price = products.reduce(
                (total, item) => total + item.quantity * item.RTP,
                0
              )
              //console.log('prooooducts:',products)
              console.log(total_price)
              console.log(orderTable)
            //sending order details mail
            const mailOption = {
                from: process.env.MAIL,
                to: customer_details.customer_email,
                subject: `${customer_details.customer_name}, thank you for your order in luchia `,
                html: `
                <div>
                    <p>Here is your order details: </p>               
                    <table>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th minW={170}>Quantity</th>
                            <th>Total</th>
                        </tr>
                        ${orderTable}
                        <tr>
                            <th>Cart Total Price: $${total_price}</th>
                        </tr>
                    </table>
                 </div>`                
              }
              
              transporter.sendMail(mailOption, (error, info)=>{
                if(error){
                  console.log(error.message)
                  return res.status(500).send('error occurred while sending email')
                }
                console.log('email sent',info.response)
                return res.send('Email sent successfully!')
              })
        
        

            // return success message
            return res.status(200).json({
                success:true,
                message:`success to add new ${controler_name} - for guest`,
                order_status: lastOrder
            })
            
        } catch (error) {
            return res.status(500).json({
                message:`error in add ${controler_name} - for guest`,
                error: error.message
                
                
            })
        }
    },

    //___________________

    add: async (req,res) => {

        try {

            // gettind values from the body request
            const {

                user,
                total_price,
                payment_details,
                products

            } = req.body;
    

            // creating new model using the values from req.body
            const new_model = new Model({
    
                user,
                total_price,
                payment_details,
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

    getAllForUser: async (req,res) => {

        try {

            const models = await Model.find({user:req.params.user_id}).populate(['products.product']).exec();

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