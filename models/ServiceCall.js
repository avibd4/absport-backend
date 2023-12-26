const { text } = require("express");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const service_call_schema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "Users",
	},
    name:{
        type:String,        
        required: true
    },
    email:{
        type:String,        
        lowercase: true,
        required: true
    },
    message:{
        type: String,
        required: true
    },	
    manager_note:{
        type: String,
    },	
	status: {
		type: Number,
		default: 1,
		min: [1, "minimum is 1"],
		max: [3, "maximum is 3"],
	},
	created_at: {
		type: Date,
		default: function () {
			return Date.now();
		},
	},

	service_call_number: {
		type: String,
		default: function () {
			return Date.now();
		},
	},
});



module.exports = mongoose.model("ServiceCall", service_call_schema);
