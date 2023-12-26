const Category = require("../models/Category");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});
module.exports = {
  // managers functions

  getAllCategoriesForManagers: async (req, res) => {
    try {
      const categories = await Category.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all categories - for managers`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -managers`,
        error: error.message,
      });
    }
  },

  getCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const category = await Category.findById(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to find category by id - for managers`,
        category,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get category by id - for -managers`,
        error: error.message,
      });
    }
  },

  addNewCategoryForManagers: async (req, res) => {
    try {
      let category_image= '';
      // gettind values from the body request
      const {
        category_name
      } = req.body;

      if(req.file !== undefined){
        console.log(req.file)
       data = await cloudinary.uploader.upload(req.file.path)
       category_image = data.secure_url;
      //category_image = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`
    }
    // creating new model using the values from req.body
    const category = new Category({
        category_name,
        category_image
      });

      console.log('imggggg', category_image)
    // actual saving
    await category.save();  

      // const { category_name } = req.body;

      // const category = new Category({
      //   category_name,
      // });

      // await category.save();

      return res.status(200).json({
        success: true,
        message: `success to add new category - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add new category - for managers`,
        error: error.message,
      });
    }
  },

  updateCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;
      const {category_name, category_image} = req.body;
      let fixedImage = category_image? category_image: "" 

      if(req.file !== undefined){
        data = await cloudinary.uploader.upload(req.file.path)
        fixedImage = data.secure_url;
        //fixedImage = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`
    }

    // creating update product using the values from req.body

    const updateCategory ={
      category_name,
      category_image: fixedImage
    }

      await Category.findByIdAndUpdate(id, updateCategory);

      return res.status(200).json({
        success: true,
        message: `success to update category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update category by id - for managers`,
        error: error.message,
      });
    }
  },
  deleteCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      await Category.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: `success to delete category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete category by id - for managers`,
        error: error.message,
      });
    }
  },

  // customers functions
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().exec();

      return res.status(200).json({
        success: true,
        message: `success to find all categories`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories`,
        error: error.message,
      });
    }
  }




  //___________________
};
