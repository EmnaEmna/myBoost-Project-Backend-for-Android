import express from 'express';
const router = express.Router();
import { generateAuthUrl, handleRedirect ,scheduleEvent} from '../controllers/calendarController.js';

router.get('/', generateAuthUrl);
router.get('/redirect', handleRedirect);
router.get('/schedule_event', scheduleEvent);

export default router;
