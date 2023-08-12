const {Router} = require('express');
const route = Router();
const {requireAuth} = require('../middleware/authentication.js')
const {home_get} = require('../controllers/contentController.js')

route.get('/',requireAuth, home_get)

module.exports = route