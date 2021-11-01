const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json(
        {
          error: true,
          message: "Wrong Credentials !"
        }
      )
    }

    const validated = await bcrypt.compare(req.body.password, user.password)
    if (!validated) {

      return res.status(401).json(
        {
          error: true,
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
        error: false,
        message: "Login Successfully !",
        data: { ...data, accessToken }
      }
    )
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router