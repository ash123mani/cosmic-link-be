const express = require('express');
const router = express.Router();
const { addLink, deleteLink, updateLink } = require('../controllers/private');
const { protect } = require('../middleware/auth');

router.route("/link").post(protect, addLink)

router.route("/link/:id").delete(protect, deleteLink)

router.route("/link/:id").patch(protect, updateLink)

module.exports = router;
