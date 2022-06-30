var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/no-ajax', function (req, res, next) {
  res.render('no-ajax.ejs', { title: '結帳' });
});
router.get('/return', function (req, res, next) {
  res.render('return', { title: '購買成功' });
});

// 藍新金流的後台回傳
router.post('/notify', function (req, res, next) {
  const { body } = req;
  res.end();
});
// 藍新金流的前台回傳
router.post('/return', function (req, res, next) {
  const { body } = req;
  res.redirect(303, '/return');
});

module.exports = router;
