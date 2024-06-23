import express from "express"
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { addLectures, createCourse } from "../controllers/admin.js";
import { uploadsFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post('/course/new', isAuth, isAdmin, uploadsFiles, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadsFiles, addLectures);

export default router;