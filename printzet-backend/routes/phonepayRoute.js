import { newPayment, checkStatus } from "../controllers/phonepayController.js";
import express from 'express';
import { phonePeAuthMiddleware } from "../middleware/phonepeAuthMiddleware.js";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router(); 

router.post('/', phonePeAuthMiddleware, newPayment);
router.post('/status/:txnId', phonePeAuthMiddleware,checkStatus);
router.post('/webhook',handleWebhook)

export default router;
