const MulterRepository = require("../repositories/upload.repository");

class MulterController {
    async uploadImage(req, res) {
        try {
            const file = req.file;
            const uploadedFile = await MulterRepository.uploadImage(file);
            res.status(200).json({
                message: "Archivo cargado con éxito!",
                file: uploadedFile,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MulterController();
