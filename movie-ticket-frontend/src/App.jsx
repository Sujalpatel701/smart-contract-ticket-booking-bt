import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Booking from "./Booking";
import Tickets from "./Tickets";
import "./App.css";


function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Book Tickets</Link> | <Link to="/tickets">View Purchases</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
