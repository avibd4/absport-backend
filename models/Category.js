const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const category_schema = new Schema({

    category_name: {
        type:String,
        required:true
    },
    category_image: {
        type: String,
        match: [/\.(jpg|jpeg|png)$/i, "must be a valid image link"],
      },
})



module.exports = mongoose.model('Categories', category_schema);