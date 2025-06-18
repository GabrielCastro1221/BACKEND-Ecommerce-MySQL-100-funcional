const { Router } = require("express");
const CartManager = require("../controllers/cart.controller");

const router = Router();

router.post("/:cid/products/:pid", CartManager.addProductInCart);
router.get("/:cid", CartManager.getProductsInCart);
router.delete("/:cid/products/:pid", CartManager.deleteProductInCart);
router.delete("/:cid", CartManager.emptyCart);
router.get("/:cid/detail", CartManager.getCartById);

module.exports = router;