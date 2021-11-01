const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const verify = require("../middlewares/verifyToken")

// ADD USER
router.post("/", verify, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { username, fullname, password, isAdmin } = req.body

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = new User({
        username,
        fullname,
        password: hashedPassword,
        isAdmin
      })

      await newUser.save()
      return res.status(201).json(
        {
          error: false,
          message: "Successfully created new user !"
        }
      )
    } else {
      return res.status(403).json(
        {
          error: true,
          message: "You're not Authorized to Add any Account !"
        }
      )
    }

  } catch (err) {
    return res.status(500).json(err)
  }
})

// UPDATE
router.get("/lala", async (req, res) => {
  console.log(req)
  // try {
  //   if (req.user.id === req.params.id || req.user.isAdmin) {
  //     const { username, fullname, profilPicture, isAdmin } = req.body
  //     let password = undefined
  //     if (req.body.password) {
  //       const salt = await bcrypt.genSalt(10)
  //       password = await bcrypt.hash(req.body.password, salt)
  //     }

  //     const updateUser = await User.findByIdAndUpdate(req.params.id, {
  //       $set: {
  //         username,
  //         fullname,
  //         password,
  //         profilPicture,
  //         isAdmin
  //       }
  //     })

  //     return res.status(200).json(
  //       {
  //         error: false,
  //         message: "Successfully update current user !"
  //       }
  //     )
  //   } else {
  //     return res.status(403).json(
  //       {
  //         error: true,
  //         message: "You're not Authorized to update this Account !"
  //       }
  //     )
  //   }

  // } catch (err) {
  //   return res.status(500).json(err)
  // }
})

// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    if (req.user.isAdmin) {

      await User.findByIdAndDelete(req.params.id)

      return res.status(200).json(
        {
          error: false,
          message: "User has been deleted !"
        }
      )
    } else {
      return res.status(403).json(
        {
          error: true,
          message: "You're not Authorized to delete this Account !"
        }
      )
    }

  } catch (err) {
    return res.status(500).json(err)
  }
})

// GET
router.get("/detail/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...data } = user._doc

    return res.status(200).json(
      {
        error: false,
        data: data
      }
    )

  } catch (err) {
    return res.status(500).json(err)
  }
})

// GET ALL
router.get("/", verify, async (req, res) => {
  try {
    let page = req.query.p ? req.query.p : 1
    const search = req.query.s
    const perpage = 10

    if (req.user.isAdmin) {

      const userCount = search
        ? await User.count({ $or: [{ username: { $regex: '.*' + search + '.*' } }, { fullname: { $regex: '.*' + search + '.*' } }] })
        : await User.count()
      const totalPage = Math.ceil(userCount / perpage)
      page = totalPage > page ? page : totalPage
      const skip = (page - 1) * perpage

      const data = search
        ? await User.find({ $or: [{ username: { $regex: '.*' + search + '.*' } }, { fullname: { $regex: '.*' + search + '.*' } }] }).sort({ _id: -1 }).skip(skip).limit(perpage)
        : await User.find().sort({ _id: -1 }).skip(skip).limit(perpage)

      return res.status(200).json(
        {
          error: false,
          totalData: userCount,
          totalPage: totalPage,
          currentPage: page,
          data
        }
      )
    } else {
      return res.status(403).json(
        {
          error: true,
          message: "You're not Authorized to access this Module !"
        }
      )
    }

  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router