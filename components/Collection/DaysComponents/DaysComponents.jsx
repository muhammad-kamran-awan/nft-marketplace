import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Link from "next/link";

//INTERNAL IMPORT
import Style from "./DaysComponents.module.css";
import images from "../../../img";
import axios from "axios";
import Collection from "../Collection";



const DaysComponents = ({ el, i }) => {

  const defaultImage1 = images[`creatorbackground${i + 2}`];
  const defaultImage2 = images[`creatorbackground${i + 4}`];
  const defaultImage3 = images[`creatorbackground${i + 3}`];

  const nftImage1 = el.nfts[0]?.image || defaultImage1;
  const nftImage2 = el.nfts[1]?.image || defaultImage2;
  const nftImage3 = el.nfts[2]?.image || defaultImage3

  return (
    <>
     <Link href={`/collection/${el.name}`}
     >
    <div className={Style.daysComponent}>
      <div className={Style.daysComponent_box}>
        <div className={Style.daysComponent_box_img}>
        {el.nfts.length > 0 ? (
            <Image
              src={el.nfts[0].image}
              className={Style.daysComponent_box_img_img}
              alt="NFT image"
              width={500}
              height={300}
              objectFit="cover"
            />
          ) : null}
        </div>

        <div className={Style.daysComponent_box_profile}>
          <Image
            src={nftImage2}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponent_box_img_1}
            objectFit="covers"
          />
          <Image
            src={nftImage3}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponent_box_img_2}
            objectFit="covers"
          />
          <Image
            src={defaultImage3}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponent_box_img_3}
            objectFit="covers"
          />
        </div>

        <div className={Style.daysComponent_box_title}>
          <h2>{el.name}</h2>
          <div className={Style.daysComponent_box_title_info_price}>
              <small>{el.totalPrice} ETH</small>
              
            </div>
        
        </div>
      </div>
    </div>
    </Link>
    </>
  );
};

export default DaysComponents;
