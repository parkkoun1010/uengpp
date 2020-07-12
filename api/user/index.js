const express = require('express');
const router = express.Router();
const ctrl = require("./user.ctrl");

// 라우팅 설정
router.get("/signup", ctrl.showSignupPage); //회원가입 페이지
router.get("/login", ctrl.showLoginPage); //로그인 페이지
router.get("/logout", ctrl.logout); // 로그아웃

router.post("/signup", ctrl.signup); //회원가입
router.post("/login", ctrl.login); //회원가입


module.exports = router;