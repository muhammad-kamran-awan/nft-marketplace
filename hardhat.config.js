require("@nomicfoundation/hardhat-toolbox");

// const NEXT_PUBLIC_POLYGON_MUMBAI_RPC =
//   "https://polygon-mumbai.g.alchemy.com/v2/RazTpRbmgiBd1I2H17vJJejMlbfhy01O";
// const NEXT_PUBLIC_PRIVATE_KEY =
//   "18e708be214fb11aa5039adda3169c29fc4566fae7059f6b34d05cf4f604d811";
/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_API_KEY = "BQiqoMA-VXdTHS4uMQ7Q3dBUDyPuhCvJ";
const SEPOLIA_PRIVATE_KEY = "71bc7babee8ef36816f661c7c999a912e7380a6bd59e422c0dacd37336f1b930"; 

module.exports = {
  solidity: "0.8.17",
  // defaultNetwork: "matic",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 31337, 
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    // polygon_mumbai: {
    //   url: NEXT_PUBLIC_POLYGON_MUMBAI_RPC,
    //   accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    // },
  },

  //   // fuji: {
  //   //   url: `Your URL`,
  //   //   accounts: [
  //   //     `0x${"Your Account"}`,
  //   //   ],
  //   // },
  // },
};
