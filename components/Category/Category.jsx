// import React from "react";
// import Image from "next/image";
// import { BsCircleFill } from "react-icons/bs";

// //INTERNAL IMPORT
// import Style from "./Category.module.css";
// import images from "../../img";

// const Category = () => {
//   const CategoryArray = [
//     {
//       images: images.creatorbackground1,
//       name: "Dance Monkey",
//     },
//     {
//       images: images.creatorbackground2,
//       name: "Sports",
//     },
//     {
//       images: images.creatorbackground3,
//       name: "Entirtment Art",
//     },
//     {
//       images: images.creatorbackground4,
//       name: "Time Life",
//     },
//     {
//       images: images.creatorbackground5,
//       name: "Animals Art",
//     },
//     {
//       images: images.creatorbackground6,
//       name: "Music",
//     },
//     {
//       images: images.creatorbackground7,
//       name: "Digital Arts",
//     },
//     {
//       images: images.creatorbackground8,
//       name: "Hubby",
//     },
//     {
//       images: images.creatorbackground8,
//       name: "Bad Arts",
//     },
//     {
//       images: images.creatorbackground9,
//       name: " Arts",
//     },
//     {
//       images: images.creatorbackground10,
//       name: "My Fav",
//     },
//   ];
//   return (
//     <div className={Style.box_category}>
//       <div className={Style.category}>
//         {CategoryArray.map((el, i) => (
//           <div className={Style.category_box} key={i + 1}>
//             <Image
//               src={el.images}
//               className={Style.category_box_img}
//               alt="Background image"
//               width={450}
//               height={250}
//               objectFit="cover"
//             />

//             <div className={Style.category_box_title}>
//               {/* <span>
//                 <BsCircleFill />
//               </span> */}
//               <div className={Style.category_box_title_info}>
//                 <h4>{el.name}</h4>
//                 <small>{i + 1}995 NFTS</small>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Category;


import React, { useState, useEffect } from "react";
import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/router';
 import images from "../../img";
import Style from "./Category.module.css";

// Here we create a mapping between category names and image URLs
const categoryImages = {
  "Digital": images.creatorbackground6,
  "Sports": images.creatorbackground6,
  "Photography": images.creatorbackground6,
  "Time": images.creatorbackground6,
  "Arts": images.creatorbackground6,
  "Music": images.creatorbackground6,
  // add more mappings as required
};

const Category = ({oldData}) => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts/categories`);
        const categories = response.data;
        //get the seller and buyer data from the old data by comparing the ipfs path


        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.name}`);
  };

  console.log("categories",categories);

  return (
    <div className={Style.box_category}>
      <div className={Style.category}>
        {categories.map((el, i) => (
          <div className={Style.category_box} key={i + 1} onClick={() => handleCategoryClick(el)}>
            <Image
              src={categoryImages[el.name]} // Use category name to get the corresponding image URL
              className={Style.category_box_img}
              alt="Background image"
              width={350}
              height={150}
              objectFit="cover"
            />

            <div className={Style.category_box_title}>
              <div className={Style.category_box_title_info}>
                <h4>{el.name}</h4>
                <small>{el.nftCount} NFTS</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;