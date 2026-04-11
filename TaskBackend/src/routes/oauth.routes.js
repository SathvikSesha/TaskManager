const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauth.controller');

router.post('/login', oauthController.loginWithProvider);

module.exports = router;
