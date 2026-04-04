const express = require("express");
const router = express.Router();

const WHATSAPP_NUMBER = "7349757596";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// GET WhatsApp contact info
router.get("/contact", (req, res) => {
  res.json({
    number: WHATSAPP_NUMBER,
    link: WHATSAPP_LINK,
    message: "Contact us on WhatsApp for orders and inquiries",
  });
});

// POST generate order message
router.post("/send-order", (req, res) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Generate order summary message with customer greeting
    let message = `🙏 *Namaste!*\n\n`;
    message += `Hello! My name is *${customerName}* and I would like to place an order for some beautiful items from your collection.\n\n`;
    message += `📞 *My Contact:*\n${phone}\n\n`;
    message += `🛍️ *Items I'm Interested In:*\n─────────────────────\n`;

    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.name}*\n`;
      message += `   💵 Price: ₹${item.price}\n`;
      if (item.size) message += `   📏 Size: ${item.size}\n`;
      if (item.color) message += `   🎨 Color: ${item.color}\n`;
      if (item.image)
        message += `   📸 Product Image: http://localhost:5000${item.image}\n`;
    });

    message += `\n─────────────────────\n`;
    message += `💰 *Total Amount: ₹${totalAmount}*\n\n`;
    message += `Please confirm the availability and provide delivery details. Thank you for considering Suvini Clothing! 🙏`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `${WHATSAPP_LINK}?text=${encodedMessage}`;

    res.json({
      success: true,
      link: whatsappLink,
      message: "WhatsApp order link generated",
      details: {
        number: WHATSAPP_NUMBER,
        items: items.length,
        totalAmount,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating WhatsApp link", error: err.message });
  }
});

// POST generate inquiry message
router.post("/send-inquiry", (req, res) => {
  try {
    const { name, email, phone, message: userMessage } = req.body;

    let message = `🙏 *Namaste!*\n\n`;
    message += `Hello! My name is *${name}* and I have an inquiry about your products.\n\n`;
    message += `📧 *My Email:* ${email || "Not provided"}\n`;
    message += `📞 *My Phone:* ${phone || "Not provided"}\n\n`;
    message += `💬 *My Message:*\n${userMessage || "No message provided"}\n\n`;
    message += `Looking forward to hearing from you! Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `${WHATSAPP_LINK}?text=${encodedMessage}`;

    res.json({
      success: true,
      link: whatsappLink,
      message: "WhatsApp inquiry link generated",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating WhatsApp link", error: err.message });
  }
});

module.exports = router;
