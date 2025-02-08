const puppeteer = require("puppeteer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const PlaceOrders = require("../models/placeOrders");

const generateInvoice = async (req, res) => {
    console.log("📄 Generating Invoice...");

    try {
        const { orderId } = req.params;
        console.log("🛒 Order ID:", orderId);

        // Fetch order details from MongoDB
        const order = await PlaceOrders.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("✅ Order Fetched:", order);

        // Read & Render EJS Template
        const templatePath = path.join(__dirname, "../views/invoice.ejs");
        const templateHtml = fs.readFileSync(templatePath, "utf-8");

        const html = ejs.render(templateHtml, { order });

        // Launch Puppeteer & Generate PDF
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        // Send PDF Response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("❌ Error generating invoice:", error);
        res.status(500).json({ message: "Error generating invoice" });
    }
};

module.exports = { generateInvoice };
