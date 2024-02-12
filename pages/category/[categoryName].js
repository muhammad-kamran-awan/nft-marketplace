import { useRouter } from 'next/router'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NFTCardTwo } from '../../collectionPage/collectionIndex';

const CategoryPage = () => {
    const router = useRouter()
    const { categoryName } = router.query
    const [nfts, setNfts] = useState([]);

    const subdomain = "https://saud-nft.infura-ipfs.io";

    useEffect(() => {
      const fetchCategoryNFTs = async () => {
          try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts/category/${categoryName}`);
              const nfts = response.data;
              // Fetch additional data for each NFT from IPFS
              for (let nft of nfts) {
                  const ipfsResponse = await axios.get(`${subdomain}/ipfs/${nft.ipfsPath}`);
                  const ipfsData = ipfsResponse.data;
                  nft.name = ipfsData.name;
                  nft.description = ipfsData.description;
                  nft.image = ipfsData.image;
              }
              setNfts(nfts);
          } catch (error) {
              console.error("Error fetching NFTs", error);
          }
      };
      if (categoryName) {
          fetchCategoryNFTs();
      }
  }, [categoryName]);

    console.log(nfts);

    return (
        <div>
        <h1 style={{textAlign:"center"}}>{categoryName}</h1>
            <NFTCardTwo    NFTData={nfts} />
        </div>
    )
}

export default CategoryPage;
