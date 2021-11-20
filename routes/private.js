const express = require('express');
const router = express.Router();
const { addLink, deleteLink, updateLink } = require('../controllers/private');
const { protect } = require('../middleware/auth');

router.route("/").post(protect, addLink)

router.route("/:id").delete(protect, deleteLink)

router.route("/:id").patch(protect, updateLink)

module.exports = router;
