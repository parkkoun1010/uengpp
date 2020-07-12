const mongoose = require("mongoose");

// 스키마 정의
// 컬렉션에 들어가는 Document의 구조를 정의
// 필드, 타입, 필수여부 등
const PlanSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true
    },
    subject:{
        type: String,
        required: true,
        trim: true
    },
    starttime:{
        type: String,
        required: true,
        trim: true
    },
    finishtime:{
        type: String,
        required: true,
        trim: true
    },
    requiredtime:{
        type: String,
        required: true,
        trim: true
    },
    created:{
        type: Date,
        default: Date.now,
    },
});

// 스키마 -> 모델
// 컬렉션 -> musics 컬렉션 생성
const Plan = mongoose.model("plan", PlanSchema);
module.exports = Plan;