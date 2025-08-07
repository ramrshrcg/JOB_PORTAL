import JWT from "jsonwebtoken";
// import errorMiddleware from "./errorMiddleware";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  // console.log(token);
  try {
    const payload = JWT.verify(token, process.env.SECRET);
    // console.log("object");
    //  console.log(payload);
    
    req.user = { userId: payload.userID };
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json({ message: error });
    // errorMiddleware(error, req, res, next);
  }

}
export default userAuth;
