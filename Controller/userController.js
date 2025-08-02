import userModel from "../models/userModel.js";

class userController {
  static async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send({ message: "Enter email and password" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "wrong email" });
    }
    // console.log(user.password);

    const isMatch = await user.comparePassword(password);
    // console.log(isMatch);
    if (!isMatch) {
      res.status(400).json({ message: "wrong password", status: 400 });
      return;
    }
    user.password = undefined; // it is done to hide password from log to make secure
    const token = user.createJWT();
    res.status(200).json({
      message: "Login Sucessful ",
      user,
      token,
      status: 200,
    });
  }

  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      // check if nanem enmail or password is entered or not
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }
      //check if email is already existed
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(400).send({
          message: "Email already existed.",
        });
      }

      const User = await userModel.create({ name, email, password });
      //token
      const token = User.createJWT(); //i dont think it makes any sense
      res.send({
        message: "User created sucessfully",
        User,
        token,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    //can update by searching name
    const { name, email, lastName, phoneNo, password } = req.body;

    const user = await userModel.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (lastName) user.lastName = lastName;
    if (phoneNo) user.phoneNo = phoneNo;
    if (password) user.password = password;

    await user.save();
    const token = user.createJWT();
    // console.log(user);

    res.status(200).json({
      message: "sucessful",
      user,
      token,
    });
  }

  
}

export { userController };
