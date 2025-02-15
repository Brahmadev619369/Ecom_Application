const Products = require("../models/products");
const PlaceOrders = require("../models/placeOrders");
// const { OpenAI } = require("openai");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const chatbotController = async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;
    console.log("User message:", message);

    let responseMessage = "I didn't understand. Please ask about orders, products, or payments.";
    const lowerMessage = message.toLowerCase();

    // Fetch last order (optimize DB calls)
    const lastOrder = await PlaceOrders.findOne({ userId }).sort({ createdAt: -1 });

    // Respond to "who are you" questions
    if (/who (are|r) (you|u)/i.test(lowerMessage)) {
        responseMessage = `👋 Hi, I'm YourCart Assistant! 🛒💬 Ask me anything about orders, products, or payments!`;
    }
    if (/hey|(hii|hi)|hello/i.test(lowerMessage)) {
        responseMessage = `Hey! How can I help you today? 😊🚀`;
    }
    if (/buy|(by|bye)|byee/i.test(lowerMessage)) {
        responseMessage = `Bye! 🚀 Have a great day 😊🚀`;
    }
    if (/what is (your|ur) name/i.test(lowerMessage)) {
        responseMessage = `👋 Hi, I'm YourCart Assistant! I don't have name! I trained by yourcart! I'm a chatbot.`;
    }
    if (/how (are|r) (you|u)?/i.test(lowerMessage)) {
        responseMessage = `I'm doing great! Thanks for asking. 😊 How about you?`;
    }
    // Order status check
    else if (/order status|where is my order/i.test(lowerMessage)) {
        responseMessage = lastOrder
            ? `Your last order status is: ${lastOrder.orderStatus}`
            : "You have no recent orders.";
    }
    // Order details check
    else if (/order details|last order/i.test(lowerMessage)) {
        responseMessage = lastOrder && lastOrder.items?.length > 0
            ? `<b style="margin-bottom:7px;">Your last order:</b><br/>${lastOrder.items.map(item =>
                // item.name).join(", ")}`
                `<div style="margin-bottom:7px;">🚀 ${item.name} - <b>₹${item.price}</b> - <span style="font-size:13px;">${item.qty} qty</span></div><hr>`).join("\n")}</div>`
            : "You haven't placed any orders yet.";
    }
    else if (/order history|orders history|tell me my (order|orders) history/i.test(message)) {
        const orders = await PlaceOrders.find({ userId }).limit(5);
        responseMessage = orders.length
            ? `Here are your last few orders: ${orders.map((o) => o.items.map((i) => `<div style="margin-bottom:7px;">🚀 ${i.name}`)).join("")}`
            : "You have no past orders.";

    } else if (/cancel order|cancel my order/i.test(message)) {
        responseMessage = "To cancel an order, visit 'My Orders' and request a cancellation.";

    } else if (/price|show products under/i.test(message)) {
        const match = message.match(/\d+/g);
        if (match && match[0]) {
            const minPrice = Number(match[0]);
            const maxPrice = match.length > 1 ? Number(match[1]) : minPrice + 50;

            const products = await Products.find({ price: { $gte: minPrice, $lte: maxPrice } }).limit(5);

            responseMessage = products.length
                ? `<b style="margin-bottom:7px;">Products in your range:</b><br/><div>${products.map((p) =>
                    `<div style="margin-bottom:7px;">🚀 ${p.name} - <b>₹${p.price}</b> - <span style="font-size:13px;">${p.category}</span></div><hr>`).join("\n")}</div>`
                : "No products found in this price range.";
        } else {
            responseMessage = "Please specify a price range (e.g., 'show products under 50').";
        }
    }    else if (/(men|mens) (product|products)|(women|womens) (product|products)|category/i.test(message)) {
        const men = message.toLowerCase().includes("men");
        const women = message.toLowerCase().includes("women");

        let filter = {};

        if (men) {
            filter = { category: "Men" };
        } else if (women) {
            filter = { category: "Women" };
        }

        // Use `aggregate()` to fetch 5 random products
        const products = await Products.aggregate([
            { $match: filter },
            { $sample: { size: 5 } }
        ]);


        responseMessage = products.length
            ? `<b style="margin-bottom:7px;">Products:</b><br/>${products.map((p) =>
                `<div style="margin-bottom:7px;">🚀 ${p.name} - <b>₹${p.price}</b> - <span style="font-size:13px;">${p.subCategory}</span></div><hr>`).join("\n")}`
            : "No products found.";
    }
     else if (/product|category/i.test(message)) {
        const keyword = message.match(/product|category\s*(\w+)/i);
        const searchTerm = keyword ? keyword[1] : "";

        const filter = searchTerm ? { category: { $regex: searchTerm, $options: "i" } } : {};

        const products = await Products.aggregate([{ $match: filter }, { $sample: { size: 5 } }]);


        responseMessage = products.length
            ? `<b style="margin-bottom:7px;">Products:</b><br/>${products.map((p) =>
                `<div style="margin-bottom:7px;">🚀 ${p.name} - <b>₹${p.price}</b> - <span style="font-size:13px;">${p.category}</span></div><hr>`).join("\n")}`
            : "No products found.";
    }
    else if (/What is the return policy?|return policy?/i.test(lowerMessage)) {
        responseMessage = "You can return items within 7 days."
    }
    else if (/Do you offer cash on delivery?|cash on delivery?|cod/i.test(lowerMessage)) {
        responseMessage = "No, Curently we are not dealing with COD method";
    }
    else if (/What payment methods do you accept?|payment methods?/i.test(lowerMessage)) {
        responseMessage = "We accept credit/debit cards, UPI, and wallets like PhonePe and Google Pay.";
    }
    else if (/How can I track my order?|track my order?/i.test(lowerMessage)) {
        responseMessage = "You can track your order from the 'My Orders' section on our website.";
    }
    else if (/Do you offer free shipping?|free shipping?/i.test(lowerMessage)) {
        responseMessage = "Yes, we offer free shipping on orders above 500 rs.";
    }
    else if (/How long does delivery take?|delivery time?/i.test(lowerMessage)) {
        responseMessage = "Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days.";
    }
    else if (/Can I exchange a product?|exchange a product?/i.test(lowerMessage)) {
        responseMessage = "Yes, exchanges are allowed within 7 days of delivery for unused items with original tags.";
    }
    else if (/What sizes do you offer?|available sizes?/i.test(lowerMessage)) {
        responseMessage = "We offer sizes from S to XXL. Check the size chart on the product page for details.";
    }
    else if (/How do I cancel my order?|cancel my order?/i.test(lowerMessage)) {
        responseMessage = "You can cancel your order from the 'My Orders' section before it is shipped.";
    }
    else if (/Do you have a physical store?|physical store?/i.test(lowerMessage)) {
        responseMessage = "Currently, we operate only online, but we provide quick delivery to your doorstep.";
    }
    else if (/Are your clothes machine washable?|machine washable?/i.test(lowerMessage)) {
        responseMessage = "Most of our clothes are machine washable. Please refer to the care instructions on the product page.";
    }
    else if (/Do you offer gift wrapping?|gift wrapping?/i.test(lowerMessage)) {
        responseMessage = "Yes, we offer gift wrapping at checkout for an additional fee.";
    }
    else if (/Can I modify my order after placing it?|modify order?/i.test(lowerMessage)) {
        responseMessage = "Once an order is placed, modifications are not possible. You can cancel and reorder instead.";
    }
    else if (/How do I know if my order is confirmed?|order confirmation?/i.test(lowerMessage)) {
        responseMessage = "You will receive an email and SMS confirmation after placing your order.";
    }
    else if (/Do you restock sold-out items?|restock items?/i.test(lowerMessage)) {
        responseMessage = "Yes, popular items are restocked frequently. You can sign up for restock notifications.";
    }
    else if (/Can I change my delivery address?|change delivery address?/i.test(lowerMessage)) {
        responseMessage = "You can update your address before the order is shipped by contacting our support team.";
    }
    else if (/Are your products ethically made?|ethically made?/i.test(lowerMessage)) {
        responseMessage = "Yes, we follow sustainable and ethical manufacturing practices.";
    }
    else if (/Do you have a loyalty program?|loyalty program?/i.test(lowerMessage)) {
        responseMessage = "Yes, our loyalty program lets you earn points on every purchase that can be redeemed for discounts.";
    }
    else if (/What if I receive a damaged product?|damaged product?/i.test(lowerMessage)) {
        responseMessage = "If you receive a damaged product, contact our support team within 24 hours for a replacement or refund.";
    } else if (/why (u|you) (are|r) here|what is (your|ur) work/i.test(lowerMessage)) {
        responseMessage = "I'm here to help you.";
    }
    else if (/thank|thank (you|u)|thanks/i.test(lowerMessage)) {
        responseMessage = "You're welcome! 😊 Let me know if you need any more help. 🚀🎉";
    }
    else if (/who (train|trained) (you|u)|who (create|created) (you|u)/i.test(lowerMessage)) {
        responseMessage = "I was trained by YourCart 😊🚀🎉";
    }
    // AI-powered response
    // else {
    //     try {
    //         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    //         const result = await model.generateContent(message);
    //         responseMessage = result.response.text() || responseMessage;
    //     } catch (error) {
    //         console.error("AI Error:", error);
    //     }
    // }

    console.log("Response:", responseMessage);
    return res.status(200).json({ message: responseMessage });
};

module.exports = { chatbotController };