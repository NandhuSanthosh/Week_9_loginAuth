const route = require("express").Router();
const fileUpload = require("express-fileupload");
const adminControllers = require('../controllers/adminControllers')
const {adminAuth} = require('../middleware/adminAuthication.js')

route.route('/login').all(adminAuth).get(adminControllers.login_get).post(adminControllers.login_post)
route.get('/logout', adminControllers.get_logout)


route.get('/',adminAuth,  adminControllers.get_home)
route.get('/getUser', adminAuth, adminControllers.get_users )

// route.post('/createUser',adminAuth, adminControllers.post_createUser)
route.delete('/deleteUser',adminAuth, adminControllers.delete_deleteUser)
route.patch('/updateUser',fileUpload({
  useTempFiles: true
}), adminControllers.patch_updateUser)

module.exports = route