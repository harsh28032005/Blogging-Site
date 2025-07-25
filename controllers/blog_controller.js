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
    let { author_id, category, tags, subcategory } = req.query;
    let filter = {
      isDeleted: false,
      isPublished: true,
    };

    if (author_id) {
      filter.author_id = author_id;
    }

    if (category) {
      filter.category = category;
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }
    if (subcategory) {
      filter.subcategory = { $in: subcategory.split(",") };
    }

    let get_blog_data = await blog.find(filter);
    if (get_blog_data.length) {
      return res
        .status(200)
        .send({ status: true, msg: "List of Blogs", data: get_blog_data });
    } else {
      return res.status(404).send({ status: false, msg: "No data found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const update_blog = async (req, res) => {
  let { title, body, tags, subcategory } = req.body;
  let { blog_id } = req.params;

  if (!blog_id)
    return res.status(400).send({ status: false, msg: "Blog id is required" });

  if (!mongoose.Types.ObjectId.isValid(blog_id))
    return res.status(400).send({ status: false, msg: "Invalid Blog id" });

  let is_blog_exist = await blog.findOne({ _id: blog_id, isDeleted: false });

  if (!is_blog_exist)
    return res
      .status(404)
      .send({ status: false, msg: "No Blog found to update" });

  if (req.body.hasOwnProperty("title") && !isNaN(title)) {
    return res.status(400).send({ status: false, msg: "Invalid blog title" });
  }
  if (req.body.hasOwnProperty("body") && !isNaN(body)) {
    return res.status(400).send({ status: false, msg: "Invalid blog body" });
  }
  if (req.body.hasOwnProperty("tags") && !isNaN(tags)) {
    return res.status(400).send({ status: false, msg: "Invalid blog tags" });
  }
  if (req.body.hasOwnProperty("subcategory") && !isNaN(subcategory)) {
    return res
      .status(400)
      .send({ status: false, msg: "Invalid blog subcategory" });
  }

  let update_blog_data = await blog.findOneAndUpdate(
    { _id: blog_id, isDeleted: false }, // filter
    {
      $set: {
        title: title,
        body: body,
        isPublished: true,
        publishedAt: new Date(),
      },
      $push: { tags: tags, subcategory: subcategory },
    }, // fields to be update
    { new: true }
  );

  return res.status(200).send({
    status: true,
    msg: "Blog updated successfully",
    data: update_blog_data,
  });
};

export const delete_blog = async (req, res) => {
  try {
    let { blog_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blog_id))
      return res.status(400).send({ status: false, msg: "Invalid blog_id" });

    let is_blog_exist = await blog.findOne({ _id: blog_id });

    if (is_blog_exist.isDeleted)
      return res
        .status(400)
        .send({ status: false, msg: "Blog is already deleted" });

    if (!is_blog_exist)
      return res
        .status(404)
        .send({ status: false, msg: "No blog found to delete" });

    let deleted_blog = await blog.findOneAndUpdate(
      { _id: blog_id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      msg: "blog is deleted successfully",
      data: deleted_blog,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const delete_blog_by_query = async (req, res) => {
  try {
    let { author_id, tag, category, subcategory, isPublished } = req.query;

    let query = { isDeleted: false };

    const standardQuery = JSON.parse(JSON.stringify(req.query));

    if (standardQuery.hasOwnProperty("author_id")) {
      if (!mongoose.Types.ObjectId.isValid(author_id))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid author_id" });
      else query["author_id"] = author_id;
    }

    if (standardQuery.hasOwnProperty("category")) {
      if (!isNaN(category))
        return res.status(400).send({ status: false, msg: "Invalid category" });
      else query["category"] = category;
    }

    if (standardQuery.hasOwnProperty("tag")) {
      if (!isNaN(tag))
        return res.status(400).send({ status: false, msg: "Invalid tag" });
      else query["tags"] = { $in: tag };
    }

    if (standardQuery.hasOwnProperty("subcategory")) {
      if (!isNaN(subcategory))
        return res
          .status(400)
          .send({ status: false, msg: "Invalid subcategory" });
      else query["subcategory"] = { $in: subcategory };
    }

    if (standardQuery.hasOwnProperty("isPublished")) {
      if (isPublished !== "true" && isPublished !== "false")
        return res
          .status(400)
          .send({ status: false, msg: "isPublished should be boolean value." });
      else query["isPublished"] = isPublished;
    }
    // console.log(query, "query");
    let deleted_blogs = await blog.updateMany(
      query, // search query
      { $set: { isDeleted: true, deletedAt: new Date() } } // update operation
    );

    if (deleted_blogs.matchedCount == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No blogs found to delete" });
    else
      return res.status(200).send({
        status: true,
        msg: "Blogs deleted successfully",
        data: deleted_blogs,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};