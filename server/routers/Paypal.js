const axios = require("axios");
const express = require("express");
const Payment = require("../models/Payment.js");

const router = express.Router();

router.post("/pay", async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const url = await createOrder({ amount, orderId });
        return res.status(200).json({ url });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi pay with paypal",
            error: {
              name: error.name,
              message: error.message || "Lỗi khi pay with paypal",
              stack: error.stack,
            },
          });
    }
});

router.get("/pay/success", async (req, res) => {
    try {
        const { orderId, token } = req.query;
        if (!token || !orderId) {
            throw new Error("Không tìm thấy mã xác thực và mã đơn hàng");
        }

        const payment = await Payment.findOne({ orderId: orderId });
        const currentTime = new Date();
        const expiresAt = new Date(payment?.createdAt?.getTime() + 15 * 60 * 1000);
        
        if (currentTime > expiresAt) {
            return res.status(400).json({
                message: "Thời gian thanh toán đã hết",
            });
        }
        const captureResult = await captureOrder(token);

        res.status(200).json({
            status: "success",
            orderId: orderId,
            captureDetails: captureResult
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi thanh toán với paypal",
            error: {
              name: error.name,
              message: error.message || "Lỗi khi thanh toán với paypal",
              stack: error.stack,
            },
          });
    }
});

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
        method: 'post',
        data: "grant_type=client_credentials",
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });
    return response.data.access_token;
}

async function createOrder({ amount, orderId }) {
    
    const access_token = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        data: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: amount,
                    },
                }
            ],
            application_context: {
                return_url: process.env.BASE_URL + "?orderId=" + orderId + "&type=Paypal",
                cancel_url: process.env.BASE_URL + "/Setting/HistoryTicket",
                brand_name: "TravFruit",
                landing_page: "NO_PREFERENCE",
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED"
            },
        })
    });
    
    const links = response.data.links || [];
    const approveUrl = links.find(link => 
        ["approve", "payer-action", "checkout"].includes(link.rel)
    )?.href;
    
    if (!approveUrl) {
        throw new Error('Không tìm thấy approve URL trong response từ PayPal. Links: ' + 
            JSON.stringify(links, null, 2));
    }
    
    return approveUrl;
}

async function captureOrder(token) {
    const access_token = await generateAccessToken();

    const response = await axios({
        method: 'post',
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${token}/capture`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    });
    
    return response.data;
}

module.exports = router;
