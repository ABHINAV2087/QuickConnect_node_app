var express = require('express');
var router = express.Router();
const usermodel = require("./users")
const postmodel = require("./post")
const localStrategy = require('passport-local');
const passport = require('passport');

passport.use(new localStrategy(usermodel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});
// router.get('/profile',isLoggedIn, function(req, res, next) {
//   res.render('profile');
// });
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  var currentuser = await usermodel.findOne({ username: req.session.passport.user })
  console.log(currentuser)
  res.render('profile', { user: currentuser });
});
router.get('/feed', isLoggedIn, async function (req, res, next) {
  // var allusers = await usermodel.find()  // jab hume users show krne honge feed page pr 
  // var allposts = await postmodel.find()  // jab hume posts show krne honge feed page pr 
  // res.render('feed1', { posts: allposts, user: currentuser });


  var currentuser = await usermodel.findOne({ username: req.session.passport.user })

  postmodel.find().populate('owner') // jab hume sirf object id se user ki puri info chaiye hoti hai 
    .then(function (allposts) {
      console.log(allposts)
      res.render('feed1', { posts: allposts, user: currentuser })
    })
});
router.get('/profile/:id', isLoggedIn, async function (req, res, next) {
  var userdetail = await usermodel.findOne({
    _id: req.params.id
  })
  res.render('profile1', { abc: userdetail })

});
router.get('/edit/:userid', isLoggedIn, function (req, res, next) {
  usermodel.findOne({ _id: req.params.userid })
    .then(function (user) {
      res.render("update", { user: user })
    })
});
router.post('/update/:userid', isLoggedIn, function (req, res, next) {
  usermodel.findOneAndUpdate({ _id: req.params.userid }, { username: req.body.username, name: req.body.name, email: req.body.email, pic: req.body.pic, details: req.body.details })
    .then(function (user) {
      res.redirect("/profile")
    })
});

router.get('/delete/:userid', isLoggedIn, function (req, res, next) {

  usermodel.findOneAndDelete({ _id: req.params.userid })
    .then(function (deleteduser) {
      console.log(deleteduser)
      res.send("user deleted")
    })



  //  usermodel.findOne({username: req.session.passport.user})
  //  .then(function(loggedInUser){
  //   usermodel.findOne({_id: req.params.userid})
  //   .then(function(finduser){
  //     if(loggedInUser.username == finduser.username){
  //       usermodel.findOneAndDelete({_id:req.params.userid})
  //       .then(function(deleteduser){
  //         console.log(deleteduser)
  //         res.send("your account has been deleted")
  //       })
  //     }
  //     else{
  //       res.send("thiis is not your account")
  //     }
  //   })
  //  })
});



router.post('/register', function (req, res, next) {
  var userdata = new usermodel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    pic: req.body.pic,
    details: null,
  })

  usermodel.register(userdata, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/feed",

  failureRedirect: "/",
  failureFlash: true,
}), function (req, res) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    else res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.redirect("/login")
  }
}

router.get('/createpost', isLoggedIn, function (req, res, next) {
  res.render('createpost')
})
router.post('/createpost', isLoggedIn, function (req, res, next) {
  usermodel.findOne({
    username: req.session.passport.user
  }).then(function (loggedInUser) {
    postmodel.create({
      owner: loggedInUser._id,
      Image: req.body.Image,
      caption: req.body.caption,
    }).then(function (newpost) {
      console.log(newpost)
      // res.send(newpost)
      res.redirect("/feed")
    })
  })
});


router.get('/postlike/:postId', isLoggedIn, function (req, res, next) {
  postmodel.findOne({
    _id: req.params.postId
  }).then(function (post) {
    usermodel.findOne({
      username: req.session.passport.user
    }).then(function (loggedInUser) {
      post.likes.push(loggedInUser._id)
      post.save().then(function (post) {
        res.redirect("back")
      })
  })
  })
})




























module.exports = router;
