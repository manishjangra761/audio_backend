const express = require("express");
const router = express.Router();
const upload = require("./middlewares/multer.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const authController = require("./controller/auth.controller");
const userController = require("./controller/user.controller");
const forgetPasswordController = require("./controller/forgetPassword.controller");
const categoryController = require("./controller/category.controller");
const audioController = require("./controller/audio.controller");
const resultController = require("./controller/result.controller");
const messageController = require("./controller/message.controller");

router.post("/add_super_admin", authController.addSuperAdmin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/register", authController.register);
//create contact message
router.post('/contact', messageController.addNewMessage);

//forget password
router.post('/forget-password', forgetPasswordController.forgetPassword);
router.post('/resetandupdate', forgetPasswordController.resetandUpdatePassword);

//common for admin and user
router.post('/admin/add_new_user', authMiddleware.authenticateJWT, authController.addNewUser) // have to change this
router.put('/admin/update_user/:id', authMiddleware.authenticateJWT, authController.updateUser)
router.delete('/admin/delete_user/:id', authMiddleware.authenticateJWT, authController.deleteUser)

// get all admin
router.get('/admin/get_all_admins', authMiddleware.authenticateJWT, authController.getAllAdmin)

//all users apis
router.get('/user/get_all_users', authMiddleware.authenticateJWT, userController.getAllUsers)
router.get('/user/profile', authMiddleware.authenticateJWT, userController.getProfile)
router.put('/user/profile', authMiddleware.authenticateJWT, userController.updateProfile)

//for adding category
router.post('/admin/add_new_category', authMiddleware.authenticateJWT, categoryController.addNewCategory)
router.get('/category/get_all_categories', authMiddleware.authenticateJWT, categoryController.getAllCategories)

//adding audio file
router.post('/admin/add_new_audio', upload.single('file'), authMiddleware.authenticateJWT, audioController.addNewAudio)

//get audio files
router.get('/audio/get_audios', authMiddleware.authenticateJWT, audioController.getAllAudios);

//get audio file foe admin
router.get('/admin/audio/get_audios', authMiddleware.authenticateJWT, audioController.getAdminAllAudios);

//delete audio file
router.delete('/audio/delete_audio/:id', authMiddleware.authenticateJWT, audioController.deleteAudio);

//update audio details of file
router.put('/audio/update_audio/:id', authMiddleware.authenticateJWT, audioController.updateAudio);

//get audio file
router.get('/audio/get_audio/:id', authMiddleware.authenticateJWT, audioController.getAudio);

//audio play record
router.post('/student/add_result', authMiddleware.authenticateJWT, resultController.addResult);

//see marks
router.get('/student/get_result', authMiddleware.authenticateJWT, resultController.getResult);

//get all contact messages
router.get('/superadmin/get_all_messages', authMiddleware.authenticateJWT, messageController.getAllMessages);


//change status read/unread
router.put('/superadmin/update_message/:id', authMiddleware.authenticateJWT, messageController.markMessageRead);

module.exports = router;

