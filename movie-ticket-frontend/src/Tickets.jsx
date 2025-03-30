import { useState, useEffect } from "react";
import axios from "axios";
import "./Tickets.css";


const API_URL = "http://localhost:5000/api/tickets";

function Tickets() {
  const [purchases, setPurchases] = useState([]);

  // ✅ Fetch all purchases for Admin Panel
  useEffect(() => {
    axios.get(`${API_URL}/purchases`)
      .then((res) => setPurchases(res.data))
      .catch((error) => console.error("Error fetching purchases:", error));
  }, []);

  return (
    <div className="container">
      <h2>🎫 Admin Panel: Ticket Purchases</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Movie</th>
            <th>Tickets</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, index) => (
            <tr key={index}>
              <td>{p.name}</td>
              <td>{p.movie}</td>
              <td>{p.quantity}</td>
              <td>
                {p.transactionId ? ( 
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${p.transactionId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {p.transactionId.substring(0, 10)}...
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tickets;
