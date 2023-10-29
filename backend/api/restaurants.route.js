import express from "express"
import resCtrl from "./restaurants.controller.js";
import reviewCtrl from "./review.controller.js";


const router = express.Router()

router.route("/").get(resCtrl.apiGetRestaurants);           //route uses this controller file
// router.route("/").get((req,res) => res.send("Hello"));

router.route("/id/:id").get(resCtrl.apiGetRestaurantById)
router.route("/cuisines").get(resCtrl.apiGetRestaurantCuisines)

router
  .route("/review")
  .post(reviewCtrl.apiPostReview)
  .put(reviewCtrl.apiUpdateReview)
  .delete(reviewCtrl.apiDeleteReview)


export default router;