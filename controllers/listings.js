// const Listing = require("../models/listing");

// module.exports.index = async (req, res, next) => {
//   const { search } = req.query;

//   let allListings;

//   if (search) {
//     allListings = await Listing.find({
//       $or: [
//         { title: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//       ],
//     });
//   } else {
//     allListings = await Listing.find({});
//   }

//   res.render("listings/index.ejs", { allListings, search });
// };

// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
// };

// module.exports.showListings = async (req, res) => {
//   let { id } = req.params;

//   const listing = await Listing.findById(id)
//     .populate("reviews")
//     .populate({
//       path: "reviews",
//       populate: {
//         path: "author",
//       },
//     })
//     .populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listings");
//   }

//   res.render("listings/show.ejs", { listing });
// };

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;

//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();

//   req.flash("success", "New Listing Created");
//   res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res, next) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listings");
//   }

//   res.render("listings/edit.ejs", { listing });
// };

// module.exports.updateListing = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !== "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing Updated");
//   res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res, next) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);

//   req.flash("success", "Listing Deleted");
//   res.redirect("/listings");
// };

const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  const { search } = req.query;

  let allListings;

  if (search) {
    // Build regex for partial and case-insensitive matching
    const regex = new RegExp(search, "i");

    allListings = await Listing.find({
      $or: [{ title: regex }, { location: regex }, { country: regex }],
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, search });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
