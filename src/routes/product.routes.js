import { Router } from "express";

import {
  getProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  getProductsByRangePrice,
  getProductsByName
} from "../controller/products.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";


const router = Router();

router.get("/", getProducts);

router.get("/:productId", getProductById);

router.post("/",[verifyToken, isAdmin], createProduct);

router.put("/:productId", [verifyToken, isAdmin], updateProductById);

router.delete("/:productId", [verifyToken, isAdmin], deleteProductById);

router.get("/:search", getProductsByName);

router.get("/priceRange/:minPrice/:maxPrice", getProductsByRangePrice);

export default router;