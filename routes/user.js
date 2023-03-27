const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const { getUserData, addCategory, deleteCategory } = require("../controllers/user");

router.route("/").get(protect, getUserData);

router.route("/category").put(protect, addCategory);

router.route("/category/:id").delete(protect, deleteCategory);

module.exports = router;
