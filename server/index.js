const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')
const User = require('./models/User');
const sendEmail = require('./utils/sendMail')
require('./config/config')

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors())

// ****  Home API ****
app.get('/', async (req, res) => {
  let data = await User.find();
  res.send(data);
})

// ****  Register API ****
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) return res.status(400).json({ message: `${oldUser.email} already taken` });

    if (!password) throw 'password is required';

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });

    const token = Jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWTKEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User created succesfully", user: newUser, auth: token });
  } catch (err) {
    res.status(500).json({ message: "An error occured", error:err });
    console.log(err);
  }

})

// ****  Login API ****
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });

    const token = Jwt.sign({ email: oldUser.email, id: oldUser._id }, process.env.JWTKEY, { expiresIn: "1h" });
    res.status(200).json({ message: "sucessfully login", user: oldUser, auth: token });
  } catch (err) {
    res.status(500).json({ message: "An error occured", error:err });
    console.log(err);
  }
})

// ****  createHtml function will create html template for mail ****
function createHtml(token) {
  let url = `${process.env.BASE_URL}/resetPassword/${token}`;
  return `<a href=${url}>Click here to reset your password</a>`;
}

// ****  Recovery email API for reset password ****
app.post('/recoveryEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exist" });
    const token = Jwt.sign({ email: user.email, id: user._id }, process.env.JWTKEY, { expiresIn: "30m" });
    const html = createHtml(token);
    let response = await sendEmail(user.email, "Password reset", html)
    if (response.status === true) {
      res.status(200).json({ message: "password reset link sent to your email account" });
      console.log(response.msg);
    } else if (response.status === false) {
      res.status(500).json({ message: "Email cannot be sent, An error occured" });
      console.log(response.msg);
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured", error:err });
  }
})

// ****  reset user's password API ****
app.post('/resetPassword', async (req, res) => {
  const { token, password } = req.body;

  try {
    const decode = Jwt.verify(token, process.env.JWTKEY);
    let user = await User.findById(decode.id)

    if (!password) throw 'password is required';

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset succesfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured", error:err });
  }
})

app.listen(process.env.PORT || 5000)