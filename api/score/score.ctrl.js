const ScoreModel = require("../../models/score");
const UserModel = require("../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const showgraph = (req, res, next) => {
  res.render("score/index");
};
const showranking = (req, res, next) => {
  const limit = parseInt(req.query.limit||10,10);
  if(Number.isNaN(limit)){
      return res.status(400).end();
  }
  //limit수만큼 music객체를 담은 배열 리턴
  ScoreModel.find((err,result) => {
      if (err) return res.status(500).end(); //next(err);
      res.render("score/ranking",{ result });
  }).limit(limit)
  .sort({score:-1})
  
};
const create = (req, res) => {
  const { score } = req.body;
  const { token } = req.cookies;

  console.log(`getuser... ${token}`);
  // 토큰이 있는 경우
  // 토큰 정합성 체크
  jwt.verify(token, "secretKey", (err, _id) => {
    if (err) {
      console.log(err);
      res.clearCookie("token");
      return res.render("user/login");
    }
    // token, DB에 저장된 token 비교
    UserModel.findOne(
      { token: token },
      { _id: 0, email: 1, name: 1 },
      (err, result) => {
        console.log(`findOne : ${result}`);
        if (!err) {
          const email = result.email;
          if (!email || !score)
            return res.status(400).send("필수항목이 입력되지 않았습니다.");
          ScoreModel.findOne({email:email},(err,result)=>{
            if(!err){
              if (result === null) {
                ScoreModel.create({ email, score }, (err, result) => {
                  if (err)
                    return res.status(500).send("등록시 오류가 발생했습니다.");
                  console.log(result);
                  res.status(201).send("시간정보가 정상적으로 등록되었습니다.");
                });
              }else{
                ScoreModel.findOneAndUpdate(
                  { email: email },
                  { $set: { score: score } },
                  { new: true },
                  (err, result) => {
                    if (err) {
                      res.status(500).send("수정 시 오류가 발생했습니다."); //throw error!!
                    } else {
                      if (!result) {
                        res.status(404).send("해당하는 정보가 없습니다.");
                      } else {
                        return res
                          .status(201)
                          .send("시간정보가 정상적으로 수정되었습니다.");
                      }
                    }
                  });
              }
            }
          })
        } else {
          console.log(err);
          res.status(500).send("무슨 오류인진 모르겠는데 일단 오류발생!");
        }
      }
    );
  });
};
module.exports = { showgraph, create, showranking };
