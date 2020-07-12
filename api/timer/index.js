const express = require('express');
const router = express.Router();
const ctrl = require("./timer.ctrl");

// 라우팅 설정
router.get("/",ctrl.stopwatch); // 소개글 출력

module.exports = router;