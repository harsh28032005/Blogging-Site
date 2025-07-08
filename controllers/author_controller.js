import author from "../models/author_model.js";

export const create_author = async (req, res) => {
  try {
    let { fname, lname, title, email, password } = req.body;

    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty." });

    if (!fname)
      return res.status(400).send({ status: false, msg: "fname is required." });

    if (fname && !isNaN(fname))
      return res.status(400).send({ status: false, msg: "Invalid fname" });

    if (!lname)
      return res.status(400).send({ status: false, msg: "lname is required." });

    if (lname && !isNaN(lname))
      return res.status(400).send({ status: false, msg: "Invalid lname" });

    if (!title)
      return res.status(400).send({ status: false, msg: "title is required." });

    if (
      title &&
      (!isNaN(title) || !["Mr", "Mrs", "Miss"].includes(title.trim()))
    )
      return res.status(400).send({
        status: false,
        msg: "Invalid title, title must be Mr, Mrs or Miss",
      });

    if (!email)
      return res.status(400).send({ status: false, msg: "email is required" });

    if (email && !isNaN(email))
      return res.status(400).send({ status: false, msg: "Invalid email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    if (password && typeof password != "string")
      return res.status(400).send({ status: false, msg: "Invalid password" });

    let email_already_exist = await author.findOne({
      email: email,
      isDeleted: false,
    });

    if (email_already_exist)
      return res
        .status(400)
        .send({ status: false, msg: "Email already used for another author" });

    let save_data = await author.create(req.body);
    return res.status(201).send({
      status: true,
      msg: "author created successfully",
      data: save_data,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export const get_all_author = async (req, res) => {
  try {
    let { fname, search } = req.query;
    let filter = { isDeleted: false };

    if (fname) {
      filter.fname = fname;
    }
    if (search) {
      filter.fname = { $regex: search, $options: "i" };
    }
    let get_author = await author
      .find(filter)
      .select({ _id: true, fname: true });

    return res
      .status(200)
      .send({ status: true, msg: "List of authors", data: get_author });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
