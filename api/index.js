const express = require('express');
const router = express.Router();

router.use("/user", require("./user"));
router.use("/aboutus", require("./aboutus"));
router.use("/plan", require("./plan"));
router.use("/timer", require("./timer"));
router.use("/swamp", require("./swamp"));
router.use("/diary", require("./diary"));
router.use("/score", require("./score"));

module.exports = router;