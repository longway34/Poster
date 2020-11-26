var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
    var protocol = 'http:';
    var redirectUrl = `${protocol}//${req.headers.host}:8080${req.baseUrl}`;
    res.redirect(redirectUrl);
})


module.exports = router;
