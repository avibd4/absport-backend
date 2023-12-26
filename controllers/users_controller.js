let controler_name = "user";
let object_name = "User";
let objects_name = "users";

let Model = require(`../models/${object_name}`);
let CartModel = require('../models/Cart')
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")


module.exports = {
  registerForCustomers: async (req, res) => {
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user: process.env.MAIL,
        pass: process.env.MAIL_SECRET
      },
    })
    try {
      // getting values from the body request
      const { user_name,
              user_email,
              user_password,
              user_phone,
              user_address } =
        req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user_name,
        user_email,
        user_password,
        user_phone: user_phone || "",
        user_address: user_address || "",
      });

      // actual saving
      await new_model.save();

      // getting values from the new user

      const user = await Model.findOne({user_email})      

      // creating new model for cart using the values from the new user
      const new_cart = new CartModel({
        user: user._id
      });

      // actual saving
      await new_cart.save();

      // getting values from the new cart
      const cart = await CartModel.findOne({user:user._id})

      //update user cart filed

      await Model.findByIdAndUpdate(user._id, {user_cart: cart._id})

      //sending confirm mail

      const mailOption = {
        from: process.env.MAIL,
        to: user.user_email,
        subject: `${user.user_name}, thank you for register to luchia `,
        // text: `Your user name is: ${user.user_email} 
        // Your password is: ${user_password} 
        // Please contact us for any question you have at number: 0542345678`
        html: `<div><p>hello ${user.user_name}</p>`+
        'here is your login details'+
        '<table>'+
          '<tr>'+
            '<td><b>USER NAME:  </b></td>'+
           `<td>${user.user_email}</td>`+
          '</tr>'+
          '<tr>'+
            '<td><b>PASSWORD:</b></td>'+
            `<td>${user_password}</td>`+
          '</tr>'+
        '</table> </div>'
        
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
        success: true,
        message: `success to add new ${controler_name}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add ${controler_name}`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const models = await Model.find().populate([
        "user_cart",
        "user_orders.order",
      ]).exec();

      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name}`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await Model.findById(req.params.id).populate([
        "user_cart",
        "user_orders.order",
      ]).exec();

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id}`,
        error: error.message,
      });
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;
      console.log('ddd:', req.body)

      if(req.body.user_name == ''){
        delete req.body.user_name
      }
      if(req.body.user_email == ''){
        delete req.body.user_email
      }
      if(req.body.user_password == ''){
        delete req.body.user_password
      }
      if(req.body.user_phone == ''){
        delete req.body.user_phone
      }  
      
      await Model.findByIdAndUpdate(id, req.body)

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id`,
        error: error.message,
      });
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;

      await Model.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete ${controler_name} by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id`,
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { user_email, user_password } = req.body;

      const user = await Model.findOne({ user_email });

      if (!user) {
        throw new Error("bad creditians");
      }

      const equal = await bcryptjs.compare(user_password, user.user_password);

      if (!equal) {
        throw new Error("bad creditians");
      }

      // user login success

      let payload = {
        user: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '10d',
      });
    
      let oldTokens = user.tokens || [];
    
      if (oldTokens.length) {
        oldTokens = oldTokens.filter(t => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 1000) {
            return t;
          }
        });
      }
    
      await Model.findByIdAndUpdate(user._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      }).exec();
      console.log(user)

      return res.status(201).json({
        success: true,
        message: "user login successfully",
        token,
        user: {
          _id:user._id,
          user_name: user.user_name,
          user_email: user.user_email,
          user_cart: user.user_cart,
          user_phone: user.user_phone,
          user_address: user.user_address
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "error in login request",
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      
      try {
        
        const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail!' });
      }
  
      const tokens = req.user.tokens;
  
      const newTokens = tokens.filter(t => t.token !== token);
  
      await Model.findByIdAndUpdate(req.user._id, { tokens: newTokens }).exec();

      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: "success to logout user",
      });
      }  catch (error) {
        return res.status(500).json({
          message: "error in logout request",
          error: error.message,
        });
      }
    
    }
  },

  authToken: async (req, res) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("no token provided");
      }

      const bearer = token.split(" ")[1];

      const decode = jwt.verify(bearer, process.env.JWT_SECRET);

      const user = await Model.findById(decode.user).exec();

      if (!user) {
        throw new Error("user not exists");
      }

      return res.status(201).json({
        success: true,
        message: "user authoraized",
        token,
        user: {
          _id:user._id,
          user_name: user.user_name,
          user_email: user.user_email,
          user_cart: user.user_cart,
          user_phone: user.user_phone,
          user_address: user.user_address

        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "unauthoraized",
        error: error.message,
      });
    }
  },

  getCustomerByIdForManager: async (req, res) => {
    try {
      const models = await Model.findById(req.params.user_id)/* .populate([
        "user_cart",
        "user_orders.order",
      ]).exec() */;

      return res.status(200).json({
        success: true,
        message: `success to find ${controler_name} by id - for manager`,
        [controler_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find ${controler_name} by id - for manager`,
        error: error.message,
      });
    }
  },

  // managers requests
  getAllCustomersForManager: async (req, res) => {
    try {
       const models = await Model.find().populate([
        "user_cart",
        "user_orders.order",
      ]).exec(); 

      //const models = await Model.find().exec();

      console.log(models);


      return res.status(200).json({
        success: true,
        message: `success to find all ${objects_name} - for manager`,
        [objects_name]: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all ${objects_name}  - for manager`,
        error: error.message,
      });
    }
  },
  deleteUserByIdForManager: async (req, res) => {
    try {
      const id = req.params.user_id;

      await Model.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete ${controler_name} by id -  - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete ${controler_name} by id - for managers`,
        error: error.message,
      });
    }
  },
  addUserForManager: async (req, res) => {
    try {
      // gettind values from the body request
      const { user_name, user_email, user_password, user_phone, user_address } =
        req.body;

      // creating new model using the values from req.body
      const new_model = new Model({
        user_name,
        user_email,
        user_password,
        user_phone: user_phone || "",
        user_address: user_address || "",
      });

      // actual saving
      await new_model.save();
      // getting values from the new user

      const user = await Model.findOne({user_email})      

      // creating new model for cart using the values from the new user
      const new_cart = new CartModel({
        user: user._id
      });

      // actual saving
      await new_cart.save();

      // getting values from the new cart
      const cart = await CartModel.findOne({user:user._id})

      //update user cart filed

      await Model.findByIdAndUpdate(user._id, {user_cart: cart._id})

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new ${controler_name}`,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: `error in add ${controler_name}`,
        error: error.message,
        
      });
    }
  },

  
  updateUserByIdForManager : async (req, res) => {
    try {
      const id = req.params.user_id;

      if(req.body.user_name == ''){
        delete req.body.user_name
      }
      if(req.body.user_email == ''){
        delete req.body.user_email
      }
      if(req.body.user_password == ''){
        delete req.body.user_password
      }
      if(req.body.user_phone == ''){
        delete req.body.user_phone
      }
      await Model.findByIdAndUpdate(id, req.body).exec(); 

      return res.status(200).json({
        success: true,
        message: `success to update ${controler_name} by id`,
        updateUser
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update ${controler_name} by id`,
        error: error.message,
      });
    }
  },
  // registerConfirmMail : async (req, res) =>{
  //   // try {
  //   //   const email = req.body.email
  //   //     const response = await magic(email);
  //   //     const message = await response.message;
  //   //     return res.status(200).json({
  //   //         message
  //   //     })
  //   // } catch (error) {
  //   //     return res.status(500).json({
  //   //         message:error.err
  //   //     })
  //   // }

  //   const transporter = nodemailer.createTransport({
  //     service:'gmail',
  //     auth:{
  //       user: process.env.MAIL,
  //       pass: process.env.MAIL_SECRET
  //     },
  //   })
  //   try {
  //     const mailOption = {
  //       from: process.env.MAIL,
  //       to: req.params.mail,
  //       subject: `${req.body.user.user_name}, thank you for register to luchia `,
  //       text: `Your user name is ${req.params.mail}
  //       please contact us for any question you have 0542345678`
  //     }
      
  //     transporter.sendMail(mailOption, (error, info)=>{
  //       if(error){
  //         console.log(error.message)
  //         return res.status(500).send('error occurred while sending email')
  //       }
  //       console.log('email sent',info.response)
  //       return res.send('Email sent successfully!')
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
};
