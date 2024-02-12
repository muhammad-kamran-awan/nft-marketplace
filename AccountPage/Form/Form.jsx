import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp, MdOutlineContentCopy } from "react-icons/md";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";

//INTERNAL IMPORT
import Style from "./Form.module.css";
import { Button } from "../../components/componentsindex.js";

const Form = ({currentAccount, formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className={Style.Form}>
      <div className={Style.Form_box}>
        <form onSubmit={onSubmit}>
          <div className={Style.Form_box_input}>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Saud Khan"
              className={Style.Form_box_input_userName}
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="email">Email</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <HiOutlineMail />
              </div>
              <input 
                name="email"
                type="text" 
                placeholder="Email*" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="6"
              placeholder="something about yourself in few words"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="website">Website</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                name="websiteLink"
                type="text" 
                placeholder="website"
                value={formData.websiteLink}
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={Style.Form_box_input_social}>
            <div className={Style.Form_box_input}>
              <label htmlFor="facebookLink">Facebook</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialFacebook />
                </div>
                <input 
                  name="facebookLink"
                  type="text" 
                  placeholder="http://facebook.com/saud" 
                  value={formData.facebookLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="twitterLink">Twitter</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialTwitter />
                </div>
                <input 
                  name="twitterLink"
                  type="text" 
                  placeholder="http://saud" 
                  value={formData.twitterLink}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={Style.Form_box_input}>
              <label htmlFor="instagramLink">Instagram</label>
              <div className={Style.Form_box_input_box}>
                <div className={Style.Form_box_input_box_icon}>
                  <TiSocialInstagram />
                </div>
                <input 
                  name="instagramLink"
                  type="text" 
                  placeholder="http://saud" 
                  value={formData.instagramLink}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={Style.Form_box_input}>
            <label htmlFor="wallet">Wallet address</label>
            <div className={Style.Form_box_input_box}>
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineHttp />
              </div>
              <input
                type="text"
                value={currentAccount ? currentAccount : "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8"}
                readOnly
              />
              <div className={Style.Form_box_input_box_icon}>
                <MdOutlineContentCopy />
              </div>
            </div>
          </div>

          <div className={Style.Form_box_btn}>
          <button
          type="submit"
         
            
          >
            submit
          </button>
            <Button
              btnName="Upload profile"
              handleClick={handleSubmit}
              classStyle={Style.button}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;