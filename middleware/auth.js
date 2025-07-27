import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  let token = req.headers["access_token"];

  if (!token)
    return res.status(401).send({ status: false, msg: "Token is missing" });

  let decoded_token = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    { ignoreExpiration: true }, // this will allow the expired token and will not assume as an err
    (err, result) => {
      if (err)
        return res.status(401).send({ status: false, msg: "Invalid Token" });
      else {
        // console.log(result, "result");
        if (Date.now() / 1000 > result.exp)
          return res.status(401).send({ status: false, msg: "Token expired" });
        else return result;
      }
    }
  );

  if (req.body?.author_id) { // ?. optional chaining  ?? nullish colescing operator
    if (decoded_token.author_id != req.body.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized Access" });
  }

  if (req.query?.author_id) {
    if (decoded_token.author_id != req.query.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized Access" });
  }

  if (req.params?.author_id) {
    if (decoded_token.author_id != req.params.author_id)
      return res
        .status(403)
        .send({ status: false, msg: "Unauthorized Access" });
  }
  next();
};
