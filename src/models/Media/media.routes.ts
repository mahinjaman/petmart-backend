import { Router } from "express";
import { getAllImage, getAllVideo, getMediaFile, manualFileUpload, urlFileUpload } from "./media.controller";
import { uploadImage, uploadVideo } from "../../middleware/uploadFiles";

const router = Router();

router.post('/urlFileUpload', urlFileUpload);
router.post('/manuallyImageUpload', uploadImage.single("file"), manualFileUpload);
router.post('/manuallyVideoUpload', uploadVideo.single("file"), manualFileUpload);
router.get("/:type/:fileName", getMediaFile);
router.get("/images", getAllImage);
router.get("/videos", getAllVideo)


export const mediaRoutes = router;