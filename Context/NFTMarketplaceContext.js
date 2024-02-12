import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
// const projectSecretKey = process.env.NEXT_PUBLIC_SECRECT_KEY;
// const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
//   "base64"
// )}`;

const projectId = "2NQrLqpCgOP63J1a3mmbmEMQgyR";
const projectSecretKey = "f0db762ae4b52cc8ecec41bcd7d511a6";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

// const subdomain = process.env.NEXT_PUBLIC_SUBDOMAIN;
const subdomain = "https://saud-nft.infura-ipfs.io";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

//INTERNAL  IMPORT hello hello
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsAddress,
  transferFundsABI,
} from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

//---CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //------USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();

  //---CHECK IF WALLET IS CONNECTD

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // console.log(accounts[0]);
      } else {
        // setError("No Account Found");
        // setOpenError(true);
        console.log("No account");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
    } catch (error) {
      // setError("Something wrong while connecting to wallet");
      // setOpenError(true);
      console.log("not connected");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts);
      setCurrentAccount(accounts[0]);

      // window.location.reload();
      connectingWithSmartContract();
    } catch (error) {
      // setError("Error while connecting to wallet");
      // setOpenError(true);
    }
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      setError("Error Uploading to IPFS");
      setOpenError(true);
    }
  };

  //---CREATENFT FUNCTION

  const createNFT = async (name, price, image, description , router, collectionName, category, username, bio) => {
    if (!name || !description || !price || !image || !category)
      return setError("Data Is Missing"), setOpenError(true);
  
    const data = JSON.stringify({ name, price , description, image , category });
    console.log(data,"data");

    const contract = await connectingWithSmartContract();
  
    try {
      const added = await client.add(data);
      const url = `${subdomain}/ipfs/${added.path}`;

    
  
      const tokenId =  await createSale(url, price);
      console.log(tokenId);

          // Get the seller and buyer of the NFT
          const sellerAndBuyer = await contract.getSellerAndBuyerOfNFT(tokenId);
          console.log(sellerAndBuyer[0]);

          // Save NFT data in your backend including seller and buyer
          //'http://localhost:8080/api/nfts'
          //use process.env.NEXT_PUBLIC_API_URL
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts`, {
              ipfsPath: added.path,
              category: category,
              seller: sellerAndBuyer[0],  // assuming that the getSellerAndBuyerOfNFT returns an object with seller and buyer properties
              owner: sellerAndBuyer[1]
          });

  
      let profileExists = false;
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}`);
        profileExists = true;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          throw error;
        }
      }
      
      if (!profileExists) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, {
          walletAddress : currentAccount,
        });
      }
  
      let collection;
      try {
        const collectionResponse =  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/${collectionName}`);
        collection = collectionResponse.data;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          throw error;
        } else {
          const newCollectionResponse =  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/collections`, {
            name: collectionName,
            description,
            nftIDs: [added.path],
            walletAddress: currentAccount,
          });
          collection = newCollectionResponse.data;
        }
      }
  
      if (collection) {
        if (!collection.nftIDs.includes(added.path)) { // Check if the NFT ID is not already in the array
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/${collectionName}`, {
            nftIDs: [...collection.nftIDs, added.path]
          });
        }
      
        console.log("runing put reqwuest");
      
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}/collections`, {
          collectionID: collection._id
        });
        router.push("/searchPage");
      }
      
    } catch (error) {
      setError("Error while creating NFT");
      console.log(error);
      setOpenError(true);
    }
  };


  // const createNFT = async (name, price, image, description, router) => {
  //   if (!name || !description || !price || !image)
  //     return setError("Data Is Missing"), setOpenError(true);

  //   const data = JSON.stringify({ name, description, image });

  //   try {
  //     const added = await client.add(data);
  //     const url = `${subdomain}/ipfs/${added.path}`;

  //     await createSale(url, price);
  //     router.push("/searchPage");
  //   } catch (error) {
  //     setError("Error while creating NFT");
  //     setOpenError(true);
  //   }
  // };

  //--- createSale FUNCTION
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id);
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      console.log(transaction);
      
      const receipt = await transaction.wait();
      const tokenIdEvent = receipt.events?.find(e => e.event === "Transfer")?.args?.tokenId;

      // Check if the token ID is returned by the event
      if(!tokenIdEvent) {
        throw new Error("Token ID not found in transaction receipt");
      }

      return tokenIdEvent.toNumber(); // make sure to return the tokenId so it can be used where createSale is called
    } catch (error) {
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
};
  //--FETCHNFTS FUNCTION

  const fetchNFTs = async () => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider(
      //   //--process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
      //   "https://polygon-mumbai.g.alchemy.com/v2/0awa485pp03Dww2fTjrSCg7yHlZECw-K"
      // );

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();
      console.log(data,"market items from contract");

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: {  image, name, description , category },
            } = await axios.get(tokenURI, {});
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              category,
              tokenURI,
            };
          }
        )
      );
      return items;

      // }
    } catch (error) {
      // setError("Error while fetching NFTS");
      // setOpenError(true);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchNFTs();
  // }, []);

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.utils.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        return items;
      }
    } catch (error) {
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  //---BUY NFTs FUNCTION
  const buyNFT = async (nft) => {
    try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}`);

      const profile = response.data;

      if (!profile.username || !profile.email) {

        toast.warning("Please update your profile before purchasing an NFT.");
        return router.push("/account");
        return
      }

      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();

//email
await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sendmail`, {
  to: profile.email,
  username: profile.username,  // get this from your user profile
  text: `Congratulations! You successfully bought the NFT '${nft.name}'!`,
});


  // Get the seller and buyer of the NFT
  // const sellerAndBuyer = await contract.getSellerAndBuyerOfNFT(tokenId);
  // console.log(sellerAndBuyer[0]);

  // // Save NFT data in your backend including seller and buyer
  // //'http://localhost:8080/api/nfts'
  // //use process.env.NEXT_PUBLIC_API_URL
  // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts`, {
  //     ipfsPath: added.path,
  //     category: category,
  //     seller: sellerAndBuyer[0],  // assuming that the getSellerAndBuyerOfNFT returns an object with seller and buyer properties
  //     owner: sellerAndBuyer[1]
  // });



      router.push("/author");
    } catch (error) {
      console.log(error,"buy nft");
      setError("Error While buying NFT",error);
      setOpenError(true);
    }
  };

  //------------------------------------------------------------------

  //----TRANSFER FUNDS

  const fetchTransferFundsContract = (signerOrProvider) =>
    new ethers.Contract(
      transferFundsAddress,
      transferFundsABI,
      signerOrProvider
    );

  const connectToTransferFunds = async () => {
    try {
      const web3Modal = new Wenb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchTransferFundsContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  //---TRANSFER FUNDS
  const [transactionCount, setTransactionCount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFunds();
        console.log(address, ether, message);

        const unFormatedPrice = ethers.utils.parseEther(ether);
        // //FIRST METHOD TO TRANSFER FUND
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "0x5208",
              value: unFormatedPrice._hex,
            },
          ],
        });

        const transaction = await contract.addDataToBlockchain(
          address,
          unFormatedPrice,
          message
        );

        console.log(transaction);

        setLoading(true);
        transaction.wait();
        setLoading(false);

        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //FETCH ALL TRANSACTION
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFunds();

        const avaliableTransaction = await contract.getAllTransactions();

        const readTransaction = avaliableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));

        setTransactions(readTransaction);
        console.log(transactions);
      } else {
        console.log("On Ethereum");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        openError,
        error,
        transferEther,
        getAllTransactions,
        loading,
        accountBalance,
        transactionCount,
        transactions,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
