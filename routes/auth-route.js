const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("auth request...");
  next();
});

//test api
router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

//post request for register
router.post("/register", async (req, res) => {
  //register validate
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //when register data validate success
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).send("信箱已經被註冊過了...");
  }

  //register success
  let { username, email, password } = req.body;
  let newUser = new User({ username, email, password });
  try {
    let savedUser = await newUser.save();
    return res.send({ msg: "用戶已註冊成功", savedUser });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//post request for login
router.post("/login", async (req, res) => {
  //login validate
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //when login data validate success
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("找不到用戶，請確認信箱是否正確...");
  }

  //compare req.body.password and data hashvalue
  foundUser.comparePassword(req.body.password, (error, isMatch) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (isMatch) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "登入成功",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤，請確認密碼是否正確...");
    }
  });
});

module.exports = router;
