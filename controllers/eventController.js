const Event = require('../models/Event');

// Create a new Event
exports.createEvent = async (req, res) => {
    const { title, image, description, date, location } = req.body;

    // Validation
    if (!title || !image || !description || !date || !location) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newEvent = new Event({
            title,
            image,
            description,
            date,
            location
        });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all events

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single event by ID
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
}

// Update an existing event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, image, description, date, location } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, {
            title,
            image,
            description,
            date,
            location
        }, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

}

// Delete an existing event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};