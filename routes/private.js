const express = require('express');
const router = express.Router();
const { addLink } = require('../controllers/private');
const { protect } = require('../middleware/auth');

router.route("/link").post(protect, addLink)

module.exports = router;
