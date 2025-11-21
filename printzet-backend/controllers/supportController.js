import SupportTicket from "../models/SupportTicket.js";

const getSupport = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
}

const postSupport = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res
      .status(400)
      .json({ message: "Subject and message are required" });
  }

  try {
    const ticket = new SupportTicket({
      user: req.user.id,
      subject,
      message,
    });
    await ticket.save();

    res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
}

export { getSupport, postSupport };