var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/no-ajax', function (req, res, next) {
  res.render('no-ajax.ejs', { title: '結帳' });
});
router.get('/notify', function (req, res, next) {
  res.render('notify', { title: '購買成功' });
});

// 藍新金流的前台回傳
router.post('/notify', function (req, res, next) {
  const { body } = req;
  res.redirect(303, '/notify');
});
// 藍新金流的後台回傳
router.post('/return', function (req, res, next) {
  const { body } = req;
  res.end();
});

module.exports = router;
