import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/author.module.css";
import Style2 from "../components/Collection/Collection.module.css";
import { Banner, NFTCardTwo } from "../collectionPage/collectionIndex";
import { Brand, FollowerTab, Title } from "../components/componentsindex";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import images from "../img";
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
} from "../authorPage/componentIndex";

//IMPORT SMART CONTRACT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import axios from "axios";
import DaysComponents from "../components/Collection/DaysComponents/DaysComponents";

const author = () => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "7d64gf748849j47fy488444",
    },
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionNfts , setCollectionNfts] = useState([]);
  // Default values
const [userDetails, setUserDetails] = useState([]);


  //IMPORT SMART CONTRACT DATA
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then((items) => {
      setNfts(items);

      console.log(nfts);
    });
  }, []);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchMyNFTs").then((items) => {
      setMyNFTs(items);
      console.log(myNFTs);
    });
  }, []);


  useEffect(() => {
    if (currentAccount) {
      fetchUserData();
      // fetchUserCollections();
    }
  }, [currentAccount]);


  console.log("user informatiohgjhghjghjgn",currentAccount)
   

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserDetails(data);
    
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };


  const fetchNFTData = async (nftID) => {
    try {
      const res = await axios.get(`https://ipfs.io/ipfs/${nftID}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      return null;
    }
  };
  
  useEffect(() => {
    const fetchCollectionAndNFTData = async () => {
      if (currentAccount) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}/collections`);
          const collections = res.data;
          // For each collection, fetch NFT data and add it to the collection
          for (const collection of collections) {
            const nftDataPromises = collection.nftIDs.map(fetchNFTData);
            const nftDataArray = await Promise.all(nftDataPromises);
            collection.nfts = nftDataArray;
            // Calculate total price of NFTs in collection
            collection.totalPrice = nftDataArray.reduce((total, nft) => total + parseFloat(nft.price), 0);
          }
          setCollections(collections);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      }
    };
  
    fetchCollectionAndNFTData();
  }, [currentAccount]);


console.log("user information",collections)

  return (
    <div className={Style.author}>
      <Banner bannerImage={images.creatorbackground2} />
      <AuthorProfileCard currentAccount={currentAccount}  userDetails = {userDetails} />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
        currentAccount={currentAccount}

      />





      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNFTS={myNFTs}
      />


<Title
        heading={`${userDetails.name || "Anonymous user"}'s Collections`}
        paragraph="Click on any collection to view its NFTs"
      />


<div className={Style2.collection}>
      <div className={Style2.collection_title}>
      </div> 
        <div className={Style2.collection_box}>
          {collections.map((el, i) => (
            <DaysComponents key={i + 1} i={i} el={el} />
          ))}
        </div>
    </div>


         <FollowerTab  />
      <Brand />
    </div>
  );
};

export default author;
