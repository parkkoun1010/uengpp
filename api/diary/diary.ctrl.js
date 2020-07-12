const DiaryModel = require("../../models/diary");
const UserModel = require("../../models/user")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// id 유효성 체크
const checkId = (req, res, next) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).end();
    }
    next();
};

// 목록조회 (localhost:3000/api/music?limit=3)
// - 성공 : limit수만큼 music 객체를 담은 배열을 리턴 (100:OK)
// - 실패 : limit가 숫자형이 아닌 경우 오류(400:Bad Request)
const list = (req, res, next) => {
    const limit = parseInt(req.query.limit||10,10);
    if(Number.isNaN(limit)){
        return res.status(400).end();
    }
    const {token} = req.cookies;
    jwt.verify(token, "secretKey", (err, _id) => {
        if(err){
            console.log(err);
          res.clearCookie("token");
          return res.render("user/login");
        }
        // token, DB에 저장된 token 비교
        UserModel.findOne({"token": token},{_id:0, email:1, name:1},(err, result)=>{
          if(!err){
            DiaryModel.find({ email: result.email},(err,result) => {
                if (err) return res.status(500).end(); //next(err);
                res.render("diary/list",{ result });
            }).limit(limit)
            .sort({_id: -1})
          }
        })
      }) 
    //limit수만큼 music객체를 담은 배열 리턴
    
};

// 상세조회 (music/:id)
// 성공 : id에 해당하는 music 객체를 리턴(200:OK)
// 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//        해당하는 id가 없는 경우 (404 : Not Found)
const detail = (req, res) => {
    const id = req.params.id;

    DiaryModel.findOne({ _id: id }, (err, result) => {
        if (err) return res.status(500).end(); //throw err
        if (!result) return res.status(404).end();
        //res.json(result);
        res.render("diary/detail",{ result });
    })
};

// 등록(localhost:3000/api/music)
// 성공 : 등록한 music 객체를 리턴 (201: Created)
// 실패 : singer, title 값 누락 시 400 반환 (400: Bad Request)
const create = (req, res) => {
    const {token} = req.cookies;
    console.log(`getuser... ${token}`);
    // 토큰이 있는 경우
    // 토큰 정합성 체크
    jwt.verify(token, "secretKey", (err, _id) => {
      if(err){
          console.log(err);
        res.clearCookie("token");
        return res.render("user/login");
      }
      // token, DB에 저장된 token 비교
      UserModel.findOne({"token": token},{_id:0, email:1, name:1},(err, result)=>{
        if(!err){
          //console.log("get token....")
          console.log(result +"결과입니당");
          //res.status(200).send(result);
          const email = result.email;
          const { title, content } = req.body;
          console.log(email, title, content);
          if (!email||!title||!content) return res.status(400).send("필수항목이 입력되지 않았습니다.");
          DiaryModel.create({ email, title, content }, (err, result) => {
              if (err) return res.status(500).send("등록시 오류가 발생했습니다.");
              res.status(201).json(result).end();
          });
        }
      })
    }) 
  
    // const { subject, starttime, finishtime, requiredtime } = req.body;
    // if (!subject || !starttime || !finishtime ||!requiredtime) return res.status(400).send("필수항목이 입력되지 않았습니다.");

    // PlanModel.create({ subject, starttime, finishtime, requiredtime }, (err, result) => {
    //     if (err) return res.status(500).send("등록시 오류가 발생했습니다.");
    //     res.status(201).json(result);
    // });
};

// 수정 (/music/:id)
// 성공 : id에 해당하는 music 객체에 입력 데이터로 변경
//        해당 객체를 반환 (200:OK)
// 실패 : 유효한 id가 아닐 경우 (400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const update = (req, res) => {
    const id = req.params.id;

    const { title, content } = req.body;

    DiaryModel.findByIdAndUpdate(
        id,
        { title, content },
        { new : true},
        (err, result) => {
            if (err) return res.status(500).send("수정 시 오류가 발생했습니다."); //throw error!!
            if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
            res.json(result);
        }
    );
};

// 삭제 (localhost:3000/api/music/:id)
// 성공 : id에 해당하는 객체를 배열에서 삭제 후 결과 배열 리턴(200: OK)
// 실패 : id가 숫자가 아닌 경우(400: Bad Request)
//        해당하는 id가 없는 경우 (404: Not Found)
const remove = (req, res) => {
    const id = req.params.id;

    // 삭제 처리
    DiaryModel.findByIdAndDelete(id, (err, result) => {
            if (err) return res.status(500).send("삭제 시 오류가 발생했습니다."); //throw error!!
            if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
            res.json(result);
        });
};
const showCreatePage = (req, res) => {
    res.render("diary/create");
};
const showUpdatePage = (req, res) => {
    const id = req.params.id;

    DiaryModel.findById(id, (err, result) => {
        if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.render("diary/update",{result});
    });
};
module.exports = { list, detail, create, update, remove, checkId, showCreatePage, showUpdatePage };
