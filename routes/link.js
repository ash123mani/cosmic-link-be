const express = require("express");
const router = express.Router();
const {
  addLink,
  deleteLink,
  updateLink,
  getLinkMeta,
  getLinks,
} = require("../controllers/link");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, addLink);

router.route("/:id").delete(protect, deleteLink);

router.route("/:id").patch(protect, updateLink);

router.route("/:category").get(protect, getLinks);

router.route("/meta").post(getLinkMeta);

module.exports = router;
