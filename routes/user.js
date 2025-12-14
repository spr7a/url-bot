const express = require("express");
const { handleSignup } = require("../controllers/user");

const router = express.Router();

router.post("/signup", handleSignup);

module.exports = router;
