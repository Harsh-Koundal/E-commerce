import express from "express";
import { documentUpload } from "../middleware/multer.middleware.js";
import { uploadDocument, getDocumentPreview, updatePrintSettings } from "../controllers/documentController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const documentRouter = express.Router();

documentRouter.post("/uploads/document", documentUpload.array('files', 10),authMiddleware, uploadDocument)
documentRouter.get('/:id/preview', getDocumentPreview);
documentRouter.put('/:id/settings', updatePrintSettings);

export default documentRouter;