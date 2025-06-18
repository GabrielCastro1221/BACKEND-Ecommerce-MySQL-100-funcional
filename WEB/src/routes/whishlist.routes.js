const { Router } = require("express");
const WishlistManager = require("../controllers/wishlist.controller");

const router = Router();

router.post("/:wid/products/:pid", WishlistManager.addProductInWishlist);
router.get("/:wid/products", WishlistManager.getProductsInWishlist);
router.delete("/:wid/products/:pid", WishlistManager.deleteProductInWishlist);
router.delete("/:wid/products", WishlistManager.emptyWishlist);
router.get("/:wid", WishlistManager.getWishlistById);

module.exports = router;