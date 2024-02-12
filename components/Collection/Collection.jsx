import React, { useState, useEffect } from "react";
import {
  BsFillAlarmFill,
  BsFillCalendarDateFill,
  BsCalendar3,
} from "react-icons/bs";
import axios from 'axios';

//INTERNAL IMPORT
import Style from "./Collection.module.css";

import DaysComponent from "./DaysComponents/DaysComponents";
import images from "../../img";

const Collection = () => {

 //fetching collection data
 const [collection, setCollection] = useState([]);
 const [collectionCopy, setCollectionCopy] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(false);

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
     setLoading(true);
     try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/all`);
       const collections = res.data;
       // For each collection, fetch NFT data and add it to the collection
       for (const collection of collections) {
         const nftDataPromises = collection.nftIDs.map(fetchNFTData);
         const nftDataArray = await Promise.all(nftDataPromises);
         collection.nfts = nftDataArray;
         // Calculate total price of NFTs in collection
         collection.totalPrice = nftDataArray.reduce((total, nft) => total + parseFloat(nft.price), 0);
       }
       setCollection(collections);
       setCollectionCopy([...collections]); // if you need a copy
       setLoading(false);
     } catch (error) {
       console.error("Error fetching collections:", error);
       setLoading(false);
       setError(true);
     }
   };
   
   fetchCollectionAndNFTData();
 }, []);

 console.log("collection", collection);



  const CardArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
    },

  ];

  console.log("CardArray", collection);

  return (
    <div className={Style.collection}>
      <div className={Style.collection_title}>
        <h2>Featured Collections</h2>
      </div> 
        <div className={Style.collection_box}>
          {collection.map((el, i) => (
            <DaysComponent key={i + 1} i={i} el={el} />
          ))}
        </div>
    </div>
  );
};

export default Collection;
