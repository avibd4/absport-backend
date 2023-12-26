const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const blog_schema = new Schema({
    title:{
        type: String,
        required: true,
    },
    created_at: {
		type: Date,
		default: function () {
			return Date.now();
		},
	},
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags:[
         {
            type: String
        }
    ],
    blog_title_image:{
        type: String,
        match: [/\.(jpg|jpeg|png)$/i, "must be a valid image link"],
      },
    blog_horizontal_image:{
        type: String,
        match: [/\.(jpg|jpeg|png)$/i, "must be a valid image link"],
      }    
})

module.exports = mongoose.model('Blogs', blog_schema )