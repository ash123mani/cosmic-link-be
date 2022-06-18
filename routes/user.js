const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const { getUserData, addCategory } = require("../controllers/user");

router.route("/").get(protect, getUserData);

router.route("/category").put(protect, addCategory);

module.exports = router;
