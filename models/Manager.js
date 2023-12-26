
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')


const Schema = mongoose.Schema;

const manager_schema = new Schema({


    manager_name:{
        type:String,
        required: true,
        unique: true
    },

    manager_email:{
        type:String,
        unique: true,
        lowercase: true,
        required: true
    },

    manager_password:{
        type:String,
        required: true
    },
    manager_phone : {
        type:String,
        match:/^([0]\d{1,3}[-])?\d{7,10}$/
    },

    manager_address : {

        city :{
            type: String,
            trim:true
        }
        ,
        street: {
            type: String,
            trim:true
        },

        building: {
            type: String,
            trim:true
        },

        appartment: {
            type: String,
            trim:true
        }

    },    

    tokens: [{ type: Object }],

    permission: {
        type: Number,
        default: 1
    }

})


manager_schema.pre('save', async function(next){

    const hash = await bcryptjs.hash(this.manager_password, 15);
    this.manager_password = hash;
    next();
})



module.exports = mongoose.model('managers', manager_schema)