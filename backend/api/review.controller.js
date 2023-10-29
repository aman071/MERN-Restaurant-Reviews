import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const restaurantId = req.body.restaurant_id
      const review = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()
      // await ReviewsDAO.injectDB(client)
      const ReviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date,
      )
      // console.log(ReviewResponse);
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id
      const text = req.body.text
      const date = new Date()

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,                   //to ensure that the person updating the review is the same who posted it.
        text,
        date,
      )

      var { error } = reviewResponse
      // if (error) {
      //   res.status(400).json({ error })
      // }

      if (reviewResponse.modifiedCount === 0) {     //review was not updated
        throw new Error(
          "unable to update review - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteReview(req, res, next) {      //remember its not standard to have anything in req.body
    try {
      const reviewId = req.query.id
      const userId = req.body.user_id   //to validate user
      console.log(reviewId)
      const reviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}