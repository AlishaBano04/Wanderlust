const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Create a new booking
router.post("/listings/:id/book", isLoggedIn, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const { startDate, endDate, guests } = req.body;

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

    let basePrice = days * listing.price * guests;

    // In case of 0 days (same day booking), consider at least 1 day
    if (days === 0) {
      basePrice = listing.price * guests;
    }

    const gst = 0.18 * basePrice;

    const totalPrice = Math.round(basePrice + gst);

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      startDate,
      endDate,
      guests,
      totalPrice,
    });

    await booking.save();

    req.flash("success", "Booking successful!");
    res.redirect("/bookings");
  } catch (e) {
    next(e);
  }
});

// Show all bookings of current user
router.get("/bookings", isLoggedIn, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .populate("user");
    res.render("bookings/index.ejs", { bookings });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
