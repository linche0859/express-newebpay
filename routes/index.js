var express = require('express');
var router = express.Router();
const {
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt,
} = require('../libs/tool');

const orders = [];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/cart', function (req, res, next) {
  res.render('cart', { title: '購物車' });
});
router.post('/cart', function (req, res, next) {
  res.json('加入購物車成功');
});
router.get('/checkout', function (req, res, next) {
  const {
    query: { ItemDesc, Amt, Email },
  } = req;
  if (!(ItemDesc && Amt && Email) || isNaN(Amt) || Number(Amt) < 1) {
    return res.render('error', {
      message: '資料不正確',
      error: { status: 400, stack: '' },
    });
  }

  const MerchantOrderNo = Math.round(new Date().getTime() / 1000);
  const TradeInfo = create_mpg_aes_encrypt({
    TimeStamp: MerchantOrderNo,
    MerchantOrderNo,
    Amt: Number(Amt),
    ItemDesc: decodeURIComponent(ItemDesc),
    Email: decodeURIComponent(Email),
  });
  const TradeSha = create_mpg_sha_encrypt(TradeInfo);

  const order = {
    MerchantID: process.env.MERCHANT_ID,
    TradeSha,
    TradeInfo,
    TimeStamp: MerchantOrderNo,
    Version: process.env.VERSION,
    MerchantOrderNo,
    Amt: Number(Amt),
    Email,
    ItemDesc,
  };
  orders.push(order);

  res.render('checkout', {
    title: '結帳',
    ...order,
  });
});

// 藍新金流的後台回傳
router.post('/notify', function (req, res, next) {
  res.end();
});
// 藍新金流的前台回傳
router.post('/return', function (req, res, next) {
  const { body } = req;
  const decodeOrder = create_mpg_aes_decrypt(body.TradeInfo);
  const order = orders.find(
    (item) =>
      item.MerchantOrderNo.toString() === decodeOrder.Result.MerchantOrderNo
  );
  if (!order) return res.status(400).json('訂單不存在');
  res.redirect(303, `/return?MerchantOrderNo=${order.MerchantOrderNo}`);
});
router.get('/return', function (req, res, next) {
  const { query } = req;
  const index = orders.findIndex(
    (item) =>
      item.MerchantOrderNo.toString() === query.MerchantOrderNo.toString()
  );
  if (index === -1) {
    return res.redirect(303, '/cart');
  }
  const { ItemDesc, Amt, Email } = orders[index];
  orders.splice(index, 1);
  res.render('return', { title: '購買成功', ItemDesc, Amt, Email });
});

module.exports = router;
