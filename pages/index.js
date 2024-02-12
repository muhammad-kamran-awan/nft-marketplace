import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  BigNFTSilder,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  AudioLive,
  FollowerTab,
  Slider,
  Brand,
  Video,
  Loader,
} from "../components/componentsindex";
import { getTopCreators } from "../TopCreators/TopCreators";

//IMPORTING CONTRCT DATA
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const { checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    // if (currentAccount) {
    fetchNFTs().then((items) => {
      console.log(nfts);
      setNfts(items.reverse());
      setNftsCopy(items);
    });
    // }
  }, []);

  //CREATOR LIST

  const creators = getTopCreators(nfts);
  // console.log(creators);

  console.log("nfts ccreators", creators);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSilder />
    
     
      {creators.length == 0 ? (
        <Loader />
      ) : (
        <FollowerTab  />
      )}

      <Slider />
  
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCard NFTData={nfts} />}

      <Collection />

      <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category oldData={nfts} />

      <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />

      <AudioLive />
      <Subscribe />
      <Brand />
      <Video />
    </div>
  );
};

export default Home;
