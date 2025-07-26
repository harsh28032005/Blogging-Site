import mongoose from "mongoose";

export const validate_request = (req, res, next) => {
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

  if (req.body.hasOwnProperty("tags")) {
    if (!Array.isArray(tags))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid format of tags" });

    if (!tags.length)
      return res.status(400).send({ status: false, msg: "Mention some tags" });

    for (let ele of tags) {
      if (!isNaN(ele)) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid tag element" });
      }
    }
  }

  if (!category)
    return res.status(400).send({ status: false, msg: "category is required" });

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
  next()
};


/* Optimized way of doing the same thing
import mongoose from "mongoose";

export const validate_mongoId = (id, field, res) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, msg: `Invalid ${field}` });
};

export const check_valid_array = (req, val, field, res) => {
  if (req.body.hasOwnProperty(`${field}`)) {
    if (!Array.isArray(val))
      return res
        .status(400)
        .send({ status: false, msg: `Invalid format of ${field}` });

    if (!val.length)
      return res
        .status(400)
        .send({ status: false, msg: `Mention some ${field}` });

    for (let ele of val) {
      if (!isNaN(ele)) {
        return res
          .status(400)
          .send({ status: false, msg: `Invalid ${field} element` });
      }
    }
  }
};

export const required_field = (val, field, res) => {
  if (!val)
    return res.status(400).send({ status: false, msg: `${field} is required` });

  if (!isNaN(val))
    return res.status(400).send({ status: false, msg: `Invalid ${field}` });
};

export const validate_request = (req, res, next) => {
  let { title, body, author_id, tags, category, subcategory } = req.body;

  required_field(title, "Title", res);
  
  required_field(body, "Body", res);

  required_field(author_id, "author id", res);

  validate_mongoId(author_id, "author id", res);

  check_valid_array(req, tags, "tags", res);

  required_field(category, "category", res);

  check_valid_array(req, subcategory, "subcategory", res);

  next();
};

 */
