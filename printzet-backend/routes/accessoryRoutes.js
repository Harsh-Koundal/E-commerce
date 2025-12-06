import express from "express";
import { getClothingCategory, getContactCardCategories, getCustomDrinkwareCategories, getLabelStickerPackagingCategories, getMugsAlbumGiftCategories, getPosterSignsCategories, getStampInkCategories, getStationeryCategories } from "../controllers/accessoryController.js";

const router = express.Router();

router.get("/clothing-printing", getClothingCategory);
router.get("/stationery-printing", getStationeryCategories);
router.get("/stamps-printing", getStampInkCategories);
router.get("/poster-printing", getPosterSignsCategories);
router.get("/labels-printing", getLabelStickerPackagingCategories);
router.get("/mugs-printing", getMugsAlbumGiftCategories);
router.get("/drinkware-printing", getCustomDrinkwareCategories);
router.get("/contact-printing", getContactCardCategories);

export default router;
  