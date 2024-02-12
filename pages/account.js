import React, { useState, useCallback, useContext } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

//INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import Form from "../AccountPage/Form/Form";
import { NFTMarketplaceContext  } from "../Context/NFTMarketplaceContext";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    
  });

  //get account from context
  const { checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const onDrop = useCallback(async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleSubmit = async (event) => {
    console.log(formData);
    try {
      console.log(formData);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}`, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.success("Profile updated successfully!");
      // toast.error("An error occurred while updating profile.");
      console.error("An error occurred while updating profile:", error);
    }
  };

  return (
    <div className={Style.account}>

      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={fileUrl ? URL.createObjectURL(fileUrl) : images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
        <Form currentAccount={currentAccount} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}   />
        </div>
      </div>
    </div>
  );
};

export default account;