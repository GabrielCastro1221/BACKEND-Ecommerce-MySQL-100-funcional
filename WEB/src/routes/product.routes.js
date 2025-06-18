const { Router } = require("express");
const ProductManager = require("../controllers/product.controller");
const upload = require("../middlewares/cloudinary.middleware");

const router = Router();

router.post(
    "/create",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "thumbnails", maxCount: 5 }
    ]),
    ProductManager.createProd
);

router.get("/", ProductManager.getPaginatedProducts);
router.get("/:id", ProductManager.getProductById);

router.put(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "thumbnails", maxCount: 5 }
    ]),
    ProductManager.updateProduct
);
router.put("/featured/:id", ProductManager.featureProduct);
router.put("/new-arrive/:id", ProductManager.newArrive);
router.put("/best-seller/:id", ProductManager.bestSeller);

router.delete("/:id", ProductManager.deleteProduct);

module.exports = router;
