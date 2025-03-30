import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import contractData from "./MovieTicket.json"; // Import Smart Contract ABI
import "./Booking.css";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC;
const API_URL = "http://localhost:5000/api/tickets";

function Booking() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [movies, setMovies] = useState([]);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [movie, setMovie] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState("0.0000");

  // ✅ Connect Wallet Function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(signer);
        setAccount(await signer.getAddress());
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  // ✅ Fetch Movies from Smart Contract
  useEffect(() => {
    if (!contractAddress || !rpcUrl) {
      console.error("Missing contract address or RPC URL in .env");
      return;
    }

    const loadContract = async () => {
      try {
        const web3Provider = new ethers.JsonRpcProvider(rpcUrl);
        const contractInstance = new ethers.Contract(contractAddress, contractData.abi, web3Provider);
        setContract(contractInstance);

        const movieList = [];
        for (let i = 0; i < 10; i++) {
          const movie = await contractInstance.getMovie(i);
          movieList.push({
            id: i,
            name: movie[0],
            price: ethers.formatEther(movie[1]),
            available: movie[2].toString(),
          });
        }
        setMovies(movieList);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    loadContract();
  }, []);

  // ✅ Update selected movie price when user selects a movie
  const handleMovieChange = (event) => {
    const selectedMovieId = parseInt(event.target.value, 10);
    setMovie(selectedMovieId);
    setSelectedPrice(movies[selectedMovieId]?.price || "0.0000");
  };

  // ✅ Buy Ticket Function
  const buyTicket = async () => {
    if (!signer || !contract) {
      alert("Please connect your wallet first!");
      return;
    }
    if (movie === "") {
      alert("Please select a movie!");
      return;
    }

    try {
      const ticketPrice = ethers.parseEther(movies[movie].price);
      const totalPrice = ticketPrice * BigInt(quantity); // Convert to BigInt for accuracy

      const tx = await contract.connect(signer).buyTicket(movie, quantity, { value: totalPrice });
      await tx.wait();

      alert("🎟️ Ticket purchased successfully!");

      // ✅ Save transaction in backend
      await axios.post(`${API_URL}/purchase`, {
        name,
        movie: movies[movie].name,
        quantity: parseInt(quantity, 10), // Ensure it's a number
        transactionId: tx.hash, // Store transaction hash
      });

      // Reset fields
      setName("");
      setMovie("");
      setQuantity(1);
      setSelectedPrice("0.0000");
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Error purchasing ticket.");
    }
  };

  return (
    <div className="container">
      <h1>🎟️ Movie Ticket Booking</h1>

      {/* ✅ Connect Wallet Button */}
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
      </button>

      {/* Ticket Purchase Form */}
      <div>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <select value={movie} onChange={handleMovieChange}>
          <option value="">Select a Movie</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Display Price of Selected Movie */}
        {movie !== "" && (
          <p>🎟️ Ticket Price: <strong>{selectedPrice} ETH</strong></p>
        )}

        <input 
          type="number" 
          min="1" 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} 
        />

        {/* Display Total Cost */}
        {movie !== "" && (
          <p>💰 Total Price: <strong>{(parseFloat(selectedPrice) * quantity).toFixed(4)} ETH</strong></p>
        )}

        <button onClick={buyTicket}>Buy Ticket</button>
      </div>
    </div>
  );
}

export default Booking;
