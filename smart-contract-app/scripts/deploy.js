const hre = require("hardhat");

async function main() {
    const MovieTicket = await hre.ethers.getContractFactory("MovieTicket");
    const movieTicket = await MovieTicket.deploy();

    await movieTicket.waitForDeployment(); // ✅ FIXED

    console.log(`MovieTicket contract deployed at: ${movieTicket.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
