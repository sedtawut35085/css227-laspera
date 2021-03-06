var express = require('express'),
    router = express.Router({mergeParams: true}),
    userss = require('../models/user'),
    creditcards = require('../models/creditcard'),
    productcart = require("../models/productcart"),
    Product = require('../models/product'),
    comment = require("../models/comments"),
    passport = require("passport"),
    middleware = require('../middleware');

let alert = require('alert');
const { body } = require('express-validator');


router.post('/addcomment',middleware.isLoggedIn, async(req,res)=>{
    req.flash('success', 'Complete to add a comment "' + req.body.comment + '"');
    console.log('addcomment')
    console.log('id : ' + req.query.id)
    console.log(req.body.comment)
    const comment12 = await Product.findById(req.query.id)
    console.log(comment12)
    var datetime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok'
    });
    const infocomment = new comment({text : req.body.comment,date : datetime})
    infocomment.author.id = req.user._id
    infocomment.author.username = req.user.username;
    infocomment.save()
    comment12.comments.push(infocomment._id)
    await comment12.save()
    res.redirect(req.session.fromUrl)
  })

  router.post('/removecomment',middleware.isLoggedIn, async(req,res)=>{
    req.flash('success', 'Remove comment success');
    console.log('removecomment')
    console.log('req.query.id : ' + req.query.idcomment)
    console.log('req.query.ids : ' + req.query.idproduct)
    await Product.findByIdAndUpdate(req.query.idproduct, 
        {$pull: {comments: req.query.idcomment}}, 
         )
    await comment.findByIdAndRemove(req.query.idcomment)
    res.redirect(req.session.fromUrl)
  })

  router.post('/editcomment',middleware.isLoggedIn, async(req,res)=>{
    req.flash('success', 'Edit comment success');
    console.log('editcomment')
    console.log('req.query.id : ' + req.query.idcomment)
    console.log('editcomment : ' + req.body.editcomment)
    await comment.findByIdAndUpdate(req.query.idcomment,{$set:{"text": req.body.editcomment}})
    res.redirect(req.session.fromUrl)
  })

module.exports = router;