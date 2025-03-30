// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MovieTicket {
    struct Movie {
        string name;
        uint256 price; // Price in wei
        uint256 availableTickets;
    }

    address public owner;
    mapping(uint256 => Movie) public movies;
    mapping(address => mapping(uint256 => uint256)) public userTickets; // Tracks user purchases

    event TicketPurchased(address buyer, uint256 movieId, uint256 quantity);

    constructor() {
        owner = msg.sender;
        
        // 🎬 Predefined movies with different prices & availability
        movies[0] = Movie("Inception", 100000000000000, 10);  // 0.0001 ETH
        movies[1] = Movie("Interstellar", 100000000000000, 8);
        movies[2] = Movie("The Matrix", 100000000000000, 15);
        movies[3] = Movie("Avatar", 120000000000000, 12);
        movies[4] = Movie("Titanic", 90000000000000, 20);
        movies[5] = Movie("The Dark Knight", 110000000000000, 10);
        movies[6] = Movie("Avengers: Endgame", 130000000000000, 18);
        movies[7] = Movie("Jurassic Park", 80000000000000, 25);
        movies[8] = Movie("Spider-Man: No Way Home", 125000000000000, 14);
        movies[9] = Movie("The Lion King", 75000000000000, 30);
    }

    function buyTicket(uint256 movieId, uint256 quantity) external payable {
        require(movies[movieId].availableTickets >= quantity, "Not enough tickets");
        require(msg.value >= movies[movieId].price * quantity, "Insufficient funds");

        movies[movieId].availableTickets -= quantity;
        userTickets[msg.sender][movieId] += quantity;

        emit TicketPurchased(msg.sender, movieId, quantity);
    }

    function getMovie(uint256 movieId) public view returns (string memory, uint256, uint256) {
        require(bytes(movies[movieId].name).length > 0, "Movie not found");
        Movie memory movie = movies[movieId];
        return (movie.name, movie.price, movie.availableTickets);
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
