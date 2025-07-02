import express from "express";
import {
  getAllAlbums,
  getAllSongs,
  getAllSongsOfAlbum,
  getSingleSong,
  getAllArtists,
  getDbInfo,
} from "./controller.js";

const router = express.Router();

router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbum);
router.get("/song/:id", getSingleSong);
router.get("/artists", getAllArtists);
router.get("/db-info", getDbInfo);

export default router;
