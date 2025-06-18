const { Router } = require('express');
const upload = require("../middlewares/cloudinary.middleware");
const MulterController = require("../controllers/upload.controllers");

const router = Router();

router.post("/upload", upload.single("photo"), MulterController.uploadImage);

module.exports = router;