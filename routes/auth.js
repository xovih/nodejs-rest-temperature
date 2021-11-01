const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, password, isAdmin } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      fullname,
      password: hashedPassword,
      isAdmin
    })

    const user = await newUser.save()
    return res.status(201).json(
      {
        failed: false,
        message: "Successfully created new user !"
      }
    )

  } catch (err) {
    return res.status(500).json(err)
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json(
        {
          failed: true,
          message: "Wrong Credentials !"
        }
      )
    }

    const validated = await bcrypt.compare(req.body.password, user.password)
    if (!validated) {

      return res.status(401).json(
        {
          failed: true,
          message: "Wrong Credentials !"
        }
      )
    }

    const { password, ...data } = user._doc
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )

    return res.status(200).json(
      {
        failed: false,
        message: "Login Successfully !",
        data: { ...data, accessToken }
      }
    )
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router