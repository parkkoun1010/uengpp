const mongoose = require("mongoose");

// 스키마 정의
// 컬렉션에 들어가는 Document의 구조를 정의
// 필드, 타입, 필수여부 등
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: Number,
        default: 0 // 0: 일반사용자, 1: 관리자
    },
    token: {
        type: String,
    }
});

// 스키마 -> 모델
// 컬렉션 -> musics 컬렉션 생성
const User = mongoose.model("user", UserSchema);
module.exports = User;