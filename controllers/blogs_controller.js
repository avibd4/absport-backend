let controler_name = "blog";
let object_name = "Blog";
let objects_name = "blogs";

let Model = require(`../models/${object_name}`);

module.exports = {
    getAllBlogsForManager: async (req, res) => {
        try {
            const models= await Model.find().exec()

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
    getBlogByIdForManager: async (req, res) => {
        try {
            const id = req.params.blog_id
            const model = await Model.findById(id).exec();

            return res.status(200).json({
                success: true,
                message: `success to find ${controler_name} by id`,
                [objects_name]: model,
              });
            
        } catch (error) {
            return res.status(500).json({
                message: `error in find ${controler_name} by id}`,
                error: error.message,
              });
        }
    },
    addBlogForManager: async (req, res) => {
        try {

            let blog_title_image = '';          
     // gettind values from the body request
            const { title, content, author, tags } = req.body;

            const fix_tags = JSON.parse(tags);
           // console.log(req.file)
            //console.log(req.files)
            

            if(req.file !== undefined){
                console.log(req.file)
            //  data = await cloudinary.uploader.upload(req.file.path)
            //   product_image = data.secure_url;
                blog_title_image = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`
            }

    // creating new model using the values from req.body
            const new_model = new Model({
                title,
                content,
                author,
                blog_title_image,
                tags: fix_tags
            });

            // actual saving
            await new_model.save();

            // return success message
            return res.status(200).json({
            success: true,
            message: `success to add new ${controler_name}`,
            });
        } catch (error) {
            return res.status(500).json({
                message: `error in add ${controler_name}`,
                error: error.message
              }); 
        }
    },
    updateBlogByIdForManager: async (req, res) => {
        try {
            const id = req.params.blog_id;
            // getting values from the body request
            const {
                title,
                author,
                content,
                blog_title_image,
                tags
            } = req.body;

            const fix_tags = JSON.parse(tags);
            let fixedImage = blog_title_image? blog_title_image : "";
            if(req.file !== undefined){
                // data = await cloudinary.uploader.upload(req.file.path)
                // req.body.product_image = data.secure_url;
                fixedImage = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`
                }
            
            const updateBlog = {
                title,
                author,
                content,
                blog_title_image: fixedImage,
                tags: fix_tags
            }
            await Model.findByIdAndUpdate(id, updateBlog).exec();

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
    deleteBlogByIdForManager: async (req, res) => {
        try {
            const id = req.params.blog_id;

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
    }
}