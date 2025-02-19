const Event = require("../models/Event");
const cloudinary = require("../utilities/cloudinary");
const fs = require("fs");
const News = require("../models/New");

// Events and News

// Create a new Event...... Working
exports.createEvent = async (req, res) => {
  const { title, description, date } = req.body;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  // Validation
  if (!title || !description || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "ChizzyKids_DB/events", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(req.file.buffer);
  });

  const image = uploadResult.secure_url;

  try {
    const newEvent = new Event({
      title,
      image,
      description,
      date,
    });
    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events.......Working
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// to get latest events for Home page 3 events.....Working
exports.getLatestEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get latest events for event page......Workin
exports.getLatestEventsPage = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(15);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single event by ID......Working
exports.getSingleEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing event.......Working
exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date } = req.body;

  try {
    
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    let image = existingEvent.image;

    // If a new image is uploaded, update it
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "ChizzyKids_DB/events", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(req.file.buffer);
      });

      image = uploadResult.secure_url;
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, image, description, date },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};



// Delete an existing event..... Working
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/// News Section

// Create news........ Working
exports.createNews = async (req, res) => {
  const { title, content } = req.body;

  // Validation
  if (!title ||!content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newNews = new News({ title, content });

    await newNews.save();

    res.status(201).json({ message: "News created successfully", news: newNews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all news ...... Working
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get latest news for Home page 3 news...... Working
exports.getLatestNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).limit(3);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get latest news for news page..... Working
exports.getLatestNewsPage = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).limit(15);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a news........ Working
exports.deleteNews = async (req, res) => {
  const { newsId } = req.params;


  try {
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update A News........ Working
exports.updateNews = async (req, res) => {

  const { newsId } = req.params;
  const { title, content } = req.body;

  try {
    
    const existingNews = await News.findById(newsId);
    if (!existingNews) {
      return res.status(404).json({ error: "News not found" });
    }

   
    // Update the event
    const updatedEvent = await News.findByIdAndUpdate(
      newsId,
      { title, content },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      updatedEvent,
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get single news...... Working
exports.getSingleNews = async (req, res) => {
 const { newsId } = req.params

try {
  const existingNews = await News.findById(newsId)

  if (!existingNews) {
    return res.status(404).json({ error: "News with ID " + newsId + " not found"});
  }
  
  res.status(200).json(existingNews);
} catch (error) {
  console.error(error, error.message)
}}