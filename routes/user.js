const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const { getUserData } = require("../controllers/user");

router.route("/").get(protect, getUserData);

module.exports = router;
