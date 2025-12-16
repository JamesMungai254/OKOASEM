import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Pay() {
  const { fileId } = useParams();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://okoasembackend.onrender.com/api/pay",
        {
          fileId,
          phone
        }
      );

      alert("Payment request sent to your phone 📲");
    } catch (err) {
      alert("Payment failed");
    }
    setLoading(false);
  };

  return (
    <div className="payment-box">
      <h2>Pay to Download</h2>

      <input
        type="text"
        placeholder="07XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay with M-Pesa"}
      </button>
    </div>
  );
}

export default Pay;
