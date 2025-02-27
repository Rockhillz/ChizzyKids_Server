const Gallery = require("../models/Gallery");
const cloudinary = require("../utilities/cloudinary");


// Create a galleryImage..... WOrks
exports.createGalleryImage = async (req, res) => {
  const { title } = req.body;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  // Validation
  if (!title) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // 

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "ChizzyKids_DB/gallery", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(req.file.buffer);
  });

  const image = uploadResult.secure_url;

  try {
    const newGallery = await new Gallery({
      title,
      image,
    });

    await newGallery.save();

    res
      .status(201)
      .json({ message: "Gallery Image Created", gallery: newGallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all gallery images for admin.....
exports.getAllGalleryImages = async (req, res) => {
  try {
    const galleryImages = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleryImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get galleries for Gallery Page.
 exports.getGalleryPageImages = async (req, res) => {
  try {
    const galleryImages = await Gallery.find().sort({ createdAt: -1 }).limit(15);
    res.status(200).json(galleryImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single gallery image by ID.....
exports.getSingleGalleryImage = async (req, res) => {
  const { id } = req.params;

  try {
    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res.status(404).json({ error: "Gallery Image not found" });
    }
    res.status(200).json(galleryImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing gallery image.....
exports.updateGalleryImage = async (req, res) => {
  const { galleryId } = req.params;
  const { title } = req.body;

  try {
    const existingGallery = await Gallery.findById(galleryId);
        if (!existingGallery) {
          return res.status(404).json({ error: "Gallery not found" });
        }
    
        let image = existingGallery.image;
    
        // If a new image is uploaded, update it
        if (req.file) {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "ChizzyKids_DB/gallery", resource_type: "image" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            ).end(req.file.buffer);
          });
    
          image = uploadResult.secure_url;
        }

        // Update Gallery
        const updatedGallery = await Gallery.findByIdAndUpdate(
          galleryId,
          { title, image},
          { new: true }
        );

        res.status(200).json({ message: "Gallery updated successfully", updatedGallery });
  } catch (error) {
    
  }
}

// Delete Gallery.
exports.deleteGalleryImage = async (req, res) => {
  const { galleryId } = req.params;

  try {
    const deletedGallery = await Gallery.findByIdAndDelete(galleryId);
    if (!deletedGallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};