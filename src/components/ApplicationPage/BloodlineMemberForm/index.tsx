import React, { FC, useEffect, useState } from "react";
import Image from "next/image";

import {
  Form,
  Button,
  InputTextField,
  DatePickerInput,
  ParentsSelectInput,
  PartnersSelectInput,
  InputTextArea,
  Avatar,
  CropImage
} from "../../Common";

import { GetAvatarImageArguments, LocalData } from "../../../utils/types";
import { getCroppedImgFromUrl } from "../../../utils";

import { Crop } from "react-image-crop";

interface BloodlineFormProps {
  bloodlineArray: LocalData[];
  onSubmit: any;
  initialValues?: any;
  deleteFamilyMember?: (id: number) => void;
}

interface BloodLineFromDataInterface {
  photoUrl?: string;
  fullName?: string;
  biography?: string;
  avatarParams?: {
    width: number;
    height: number;
    crop: Crop;
  }
}

export const BloodlineMemberFrom: FC<BloodlineFormProps> = ({
  bloodlineArray,
  onSubmit,
  initialValues,
  deleteFamilyMember,
}) => {
  const buttonName = initialValues ? "Save" : "Add";
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [deathDate, setDeathDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<BloodLineFromDataInterface>({});

  const [editAvatarPopUpActive, setEditAvatarPopUpActive] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | undefined>();
  const [avatarImage, setAvatarImage] = useState<string | undefined>();

  useEffect(() => {
    if (initialValues) {
      setBirthDate(new Date(initialValues.dateOfBirth));
      if (initialValues.dateOfDeath) {
        setDeathDate(new Date(initialValues.dateOfDeath));
      }
      if (initialValues.photoUrl) {
        setImageToCrop(initialValues.photoUrl);
        const avatarParams = initialValues.avatarParams;
        getCroppedImgFromUrl(initialValues.photoUrl, avatarParams.crop, avatarParams.width, avatarParams.height).then(image  => setAvatarImage(image))
      }
    }
  }, [initialValues]);

  useEffect(() => {
    if (formData.photoUrl) {
      if (formData.photoUrl.length >= 1) {
        setImageToCrop(formData.photoUrl);
      }
    }

    if (formData.photoUrl?.length === 0) {
      setImageToCrop(undefined);
    }

  }, [formData.photoUrl]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleClickEditAvatar = () => {
    setEditAvatarPopUpActive(!editAvatarPopUpActive);
  }

  const getAvatarImage = (args: GetAvatarImageArguments) => {
    const { image, width, height, crop } = args;

    setFormData((prevFormData) => ({
      ...prevFormData,
      avatarParams: {
        width,
        height,
        crop
      },
    }));

    setAvatarImage(image);
    setEditAvatarPopUpActive(false);
  }

  const handleSubmit = (e: any) => {
    const values = {
      ...e,
    };

    if (formData.avatarParams) {
      Object.assign(values, {avatarParams: formData.avatarParams})
    }

    onSubmit(values)
  }

  return (
    <div
      style={{
        backgroundColor: "#C9B79C",
        borderRadius: "16px",
        padding: "1.2rem 1rem",
        width: "1000px",
      }}
    >
      <Form onSubmit={(e) => handleSubmit(e)} initialValues={initialValues}>
        <div className="flex justify-between relative">
          <div className="w-[70%]">
            <InputTextField
              name="fullName"
              label="Full Name"
              onChange={handleInputChange}
              validate={["required", "nameAndDescriptionSymbols", ["maxLength", 100]]}
              required
            />

            <div className="flex justify-between items-center">
              <div className="w-full mr-4">
                <DatePickerInput
                  name="dateOfBirth"
                  label="Date of Birth"
                  onChange={(date) => setBirthDate(date)}
                  selected={birthDate}
                  maxDate={deathDate || undefined}
                  placeholderText="Enter date of birth..."
                  validate={["required"]}
                  required
                />
              </div>
              <div className="w-full">
                <DatePickerInput
                  name="dateOfDeath"
                  label="Date of Death"
                  onChange={(date) => setDeathDate(date)}
                  minDate={birthDate || undefined}
                  selected={deathDate}
                  placeholderText="Leave this field blank if neccessary..."
                />
              </div>
            </div>
          </div>

          <div className="w-[30%] flex items-center justify-center relative">
            <Avatar onClick={handleClickEditAvatar} image={avatarImage} />

            {editAvatarPopUpActive && (
              <div className="absolute bottom-[-430px] right-[120px] w-[800px] h-[540px] bg-[#C9B79C] z-10 p-4 border-2 rounded-2xl border-[#3C312B] ">
                <div className="relative">
                  <Image src="/close.png" alt="close_button" width={14} height={14} className="absolute top-0 right-0 cursor-pointer" onClick={() => setEditAvatarPopUpActive(false)}/>
                  <InputTextField
                    name="photoUrl"
                    label="Photo URL"
                    onChange={handleInputChange}
                    validate={[["maxLength", 500], "urlRequiredSymbolsOnly", "urlShouldStartFromHTTPS"]}
                  />

                  <div className="p-4">
                    <CropImage src={imageToCrop ? imageToCrop : ""} onClickSave={getAvatarImage} initialValues={initialValues?.avatarParams?.crop}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
        <InputTextArea
          name="biography"
          label="Biography"
          onChange={handleInputChange}
          validate={["descriptionSymbols", ["maxLength", 1000]]}
        />
        <ParentsSelectInput
          name="parents"
          label="Parents"
          options={bloodlineArray}
        />

        <PartnersSelectInput
          name="partners"
          label="Partners"
          options={
            initialValues
              ? bloodlineArray.filter((item) => item.id !== initialValues.id)
              : bloodlineArray
          }
        />

        <div className="flex justify-evenly">
          <Button type="submit" name={buttonName} disabled={false} />
          {deleteFamilyMember && (
            <Button
              type="button"
              name={"Delete"}
              disabled={false}
              onClick={() => deleteFamilyMember(initialValues.id)}
            />
          )}
        </div>
      </Form>
    </div>
  );
};
