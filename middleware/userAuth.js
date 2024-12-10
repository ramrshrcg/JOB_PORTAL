import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res.status(500).json({ message: error });
  }

}
export default userAuth;
