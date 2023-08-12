const {Router} = require('express');
const route = Router();
const authControllers = require('../controllers/authControllers.js');
const { requireAuth } = require('../middleware/authentication.js');
const fileUpload = require("express-fileupload")


route.get('/signin', requireAuth,  authControllers.signin_get)
route.get('/login', requireAuth, authControllers.login_get)
route.post('/signin', fileUpload({
  useTempFiles: true
}),requireAuth, authControllers.signin_post)
route.post('/login', requireAuth, authControllers.login_post)
route.get('/logout', requireAuth, authControllers.logout_get);

module.exports = route;
