const router = require("express").Router()
const Device = require("../models/Device")
const verify = require("../middlewares/verifyToken")

router.use(verify)

// ADD Arduino Device
router.post("/", async (req, res) => {
	try {
		const { name, location } = req.body
		const newDevice = new Device({
			name,
			location,
		})

		const device = await newDevice.save()

		return res.status(201).json({
			error: false,
			message: "Successfully adding New Device !",
			data: device,
		})
	} catch (err) {
		return res.status(500).json(err)
	}
})

// UPDATE Arduino Device
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params
		const { name, location } = req.body

		await Device.findByIdAndUpdate(id, {
			$set: {
				name,
				location,
			},
		})

		return res.status(200).json({
			error: false,
			message: "Successfully Update Device Information !",
		})
	} catch (err) {
		return res.status(500).json(err)
	}
})

// DELETE Arduino Device
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params

		await Device.findByIdAndDelete(id)

		return res.status(200).json({
			error: false,
			message: "Successfully Delete the Device !",
		})
	} catch (err) {
		return res.status(500).json(err)
	}
})

// GET
router.get("/:id", async (req, res) => {
	try {
		const device = await Device.findById(req.params.id)

		return res.status(200).json({
			error: false,
			data: device,
		})
	} catch (err) {
		return res.status(500).json(err)
	}
})

// GET ALL
router.get("/", async (req, res) => {
	try {
		let page = req.query.p ? req.query.p : 1
		const search = req.query.s
		const perpage = 10

		const deviceCount = search
			? await Device.count({
					$or: [
						{ name: { $regex: ".*" + search + ".*", $options: "si" } },
						{ location: { $regex: ".*" + search + ".*", $options: "si" } },
					],
			  })
			: await Device.count()
		const totalPage = Math.ceil(deviceCount / perpage)
		page = totalPage > page ? page : totalPage
		const skip = (page - 1) * perpage

		const data = search
			? await Device.find({
					$or: [
						{ name: { $regex: ".*" + search + ".*", $options: "si" } },
						{ location: { $regex: ".*" + search + ".*", $options: "si" } },
					],
			  })
					.sort({ _id: -1 })
					.skip(skip)
					.limit(perpage)
			: await Device.find().sort({ _id: -1 }).skip(skip).limit(perpage)

		return res.status(200).json({
			error: false,
			totalData: deviceCount,
			totalPage: totalPage,
			currentPage: page,
			data,
		})
	} catch (err) {
		return res.status(500).json(err)
	}
})

module.exports = router
