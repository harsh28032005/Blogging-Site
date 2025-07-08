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

    if (fname && !isNaN(fname.trim()))
      return res.status(400).send({ status: false, msg: "Invalid fname" });

    if (!lname)
      return res.status(400).send({ status: false, msg: "lname is required." });

    if (lname && !isNaN(lname.trim()))
      return res.status(400).send({ status: false, msg: "Invalid lname" });

    if (!title)
      return res.status(400).send({ status: false, msg: "title is required." });

    if (title && !["Mr", "Mrs", "Miss"].includes(title.trim()))
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid title, title must be Mr, Mrs or Miss",
        });

    if (!email)
      return res.status(400).send({ status: false, msg: "email is required" });

    if (email && !isNaN(email))
      return res.status(400).send({ status: false, msg: "Invalid email" });

    let email_already_exist = await author.findOne({ email: email });

    if (email_already_exist)
      return res
        .status(400)
        .send({ status: false, msg: "Already used email for another author" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    if (password && typeof password.trim() != "string")
      return res.status(400).send({ status: false, msg: "Invalid password" });

    let save_data = await author.create(req.body)
    return res
      .status(201)
      .send({
        status: true,
        msg: "author created successfully",
        data: save_data,
      });
  } catch(err){
    return res
      .status(500)
      .send({ status: false, msg: err.message });
  }
};
