import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios';
import images from "../../img";
//INTERNAL IMPORT
import Style from "../../styles/collection.module.css";
import {
  Banner,
  CollectionProfile,
  NFTCardTwo,
} from "../../collectionPage/collectionIndex";
import { Slider, Brand } from "../../components/componentsindex";
import Filter from "../../components/Filter/Filter";

export default function SingleCategory({collection}) {

    const router = useRouter()
    const { name } = router.query
    console.log(collection, "name");

    const collectionArray = [
        {
          image: images.nft_image_1,
        },
        {
          image: images.nft_image_2,
        },
        {
          image: images.nft_image_3,
        },
        {
          image: images.nft_image_1,
        },
        {
          image: images.nft_image_2,
        },
        {
          image: images.nft_image_3,
        },
        {
          image: images.nft_image_1,
        },
        {
          image: images.nft_image_2,
        },
      ];



    return (
        <div>
        <div className={Style.collection}>
      <Banner bannerImage={images.creatorbackground1} />
      <CollectionProfile collection={collection} />
      <Filter />
    
      <NFTCardTwo NFTData={collection?.ipfsData} />

      <Slider />
      <Brand />
    </div>
        </div>
    )
}

export async function getStaticPaths() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/all`);
    const collections = response.data;

    console.log(collections);  // Log collections

    const paths = collections
        .filter((collection) => {
            console.log(collection.name);  // Log each collection's name
            return collection.name;
        })
        .map((collection) => ({
            params: { name: collection.name },
        }));

    return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
    const { name } = params;
    console.log(name);  // Log the collection name
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/${name}`);
    const collection = response.data;
    const subdomain = "https://saud-nft.infura-ipfs.io";
    console.log(collection, "test collection");  // Log the collection

    // Initialize total price
    let totalPrice = 0;

    // Check if collection.nftIDs is an array and has items in it
    if (Array.isArray(collection.nftIDs) && collection.nftIDs.length) {
        // Fetch additional data for each NFT from IPFS
        for (let nftID of collection.nftIDs) {
            const ipfsResponse = await axios.get(`${subdomain}/ipfs/${nftID}`);
            const ipfsData = ipfsResponse.data;
            
            // Add the price of the NFT to the total price
            if (ipfsData.price) {
                totalPrice += ipfsData.price;
            }

            // If collection.ipfsData does not exist, create it as an empty array
            if (!collection.ipfsData) {
                collection.ipfsData = [];
            }

            // Push ipfsData into the collection.ipfsData array
            collection.ipfsData.push(ipfsData);
        }
    }

    // Add total price to the collection object
    collection.totalPrice = totalPrice;

    return {
        props: {
            collection,
        },
        revalidate: 60, // In seconds
    };
}