import mongoose from "mongoose";
import author from "../models/author_model.js";
import blog from "../models/blog_model.js";

export const create_blog = async (req, res) => {
  try {
    let { title, body, author_id, tags, category, subcategory } = req.body;

    if (!title)
      return res.status(400).send({ status: false, msg: "Title is required" });

    if (!isNaN(title))
      return res.status(400).send({ status: false, msg: "Invalid Title" });

    if (!body)
      return res.status(400).send({ status: false, msg: "Body is required" });

    if (!isNaN(body))
      return res.status(400).send({ status: false, msg: "Invalid Body" });

    if (!author_id)
      return res.status(400).send({ status: false, msg: "author is required" });

    if (!mongoose.Types.ObjectId.isValid(author_id))
      return res.status(400).send({ status: false, msg: "Invalid author" });

    let is_author_exist = await author.findOne({
      _id: author_id,
      isDeleted: false,
    });

    if (!is_author_exist)
      return res.status(404).send({ status: false, msg: "No author found" });

    if (req.body.hasOwnProperty("tags")) {
      if (!Array.isArray(tags))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of tags" });

      if (!tags.length)
        return res
          .status(400)
          .send({ status: false, msg: "Mention some tags" });

      for (let ele of tags) {
        if (!isNaN(ele)) {
          return res
            .status(400)
            .send({ status: false, msg: "Invalid tag element" });
        }
      }
    }

    if (!category)
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });

    if (!isNaN(category))
      return res.status(400).send({ status: false, msg: "Invalid category" });

    if (subcategory) {
      if (!Array.isArray(subcategory))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid format of subcategory" });

      if (!subcategory.length)
        return res
          .status(400)
          .send({ status: false, msg: "Mention some subcategories" });

      for (let ele of subcategory) {
        if (!isNaN(ele)) {
          return res
            .status(400)
            .send({ status: false, msg: "Invalid subcategory element" });
        }
      }
    }

    let save_blog = await blog.create(req.body);

    return res.status(201).send({
      status: true,
      msg: "Blog created successfully",
      data: save_blog,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_blog = async (req, res) => {
  try {
    let get_blog_data = await blog.find({
      isDeleted: false,
      isPublished: true,
    });
    if (get_blog_data.length) {
      return res
        .status(200)
        .send({ status: true, msg: "List of Blogs", data: get_blog_data });
    }
    else{
      return res.status(404).send({status: false, msg: "No data found"})
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// export const update_blog = async (req, res) => {
//   let {title, body, tags, subcategory} = req.body
//   let {blog_id} = req.params
//   if(!blog_id && {isDeleted:false})
// }