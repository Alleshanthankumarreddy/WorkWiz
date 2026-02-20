import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const QuoteCard = ({ msg, role, isMe }) => {

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (!msg.quoteId) return;

    axios
      .get(`http://localhost:5000/api/quote/getQuoteByBooking/${msg.quoteId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setQuote(res.data.quote))
      .catch(console.error);

  }, [msg.quoteId]);

  if (!quote) return null;

  return (
    <div className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="bg-white shadow rounded-2xl p-4 max-w-[320px]">

        <div className="font-semibold mb-2">Quote Details</div>

        <div className="text-sm">🛠 {quote.description}</div>
        <div className="text-sm">💰 ₹{quote.totalAmount}</div>
        <div className="text-sm">
          ⏰ {new Date(quote.startTime).toLocaleString()}
        </div>

        {/* ⭐ Show buttons ONLY to customer & pending */}
        {role === "customer" && quote.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded-lg"
              onClick={() => respondToQuote(quote._id, "accept", setQuote)}
            >
              Accept
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded-lg"
              onClick={() => respondToQuote(quote._id, "reject", setQuote)}
            >
              Reject
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
const respondToQuote = async (quoteId, action, setQuote) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/quote/handleQuoteResponse`,
      { quoteId, action },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    /* ✅ USE SERVER RESPONSE */
    setQuote(prev => ({
      ...prev,
      status: res.data.status   // ⭐ IMPORTANT
    }));

  } catch (err) {
    alert("Failed to update quote");
    console.log(err);
  }
};



export default QuoteCard;