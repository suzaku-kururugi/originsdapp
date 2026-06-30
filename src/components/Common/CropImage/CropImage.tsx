import React, { FC, useState, useRef, useEffect } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from "react-image-crop";
import { GetAvatarImageArguments } from "../../../utils/types";
import { getCroppedImg } from "../../../utils";
import { Button } from "../Buttons";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 60;

export const CropImage: FC<{
  src: string,
  initialValues?: Crop,
  onClickSave: (args: GetAvatarImageArguments) => void
}> = ({
  src,
  initialValues,
  onClickSave
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState(src);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (initialValues) {
      setCrop(initialValues)
    }
  }, [])

  useEffect(() => {
    setAvatarImageURL(src);
    setIsDefaultImage(false);
  }, [src])

  const handleClickSave = () => {
    if (imageRef.current && crop) {
      const croppedImage = getCroppedImg(imageRef.current, crop);

      onClickSave({
        image: croppedImage,
        width: imageRef.current.width,
        height: imageRef.current.height,
        crop
      });
    }
  };

  const imgErrorHandler = () => {
    setAvatarImageURL("/avatar_default.png");
    setIsDefaultImage(true);

    const defaultCropValue = makeAspectCrop(
      {
        unit: "px",
        width: 360,
      },
      ASPECT_RATIO,
      360,
      360
    );

    // nobody knows how it work
    const centredCrop = centerCrop(defaultCropValue, 360, 360);

    setCrop(centredCrop)
  }

  const onImageLoad = (e: any) => {
    if (isDefaultImage) {
      return;
    }

    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "px",
        width: MIN_DIMENSION,
      },
      ASPECT_RATIO,
      width,
      height
    );

    if (initialValues) {
      setCrop(initialValues);
    } else {
      const centredCrop = centerCrop(crop, width, height);
      setCrop(centredCrop);
    }
  }

  const regex = /^https:\/\/.+$/;

  return (
    <div className="relative flex flex-col justify-center items-center">
      <ReactCrop
        crop={crop}
        onChange={newCrop => setCrop(newCrop)}
        circularCrop
        aspect={ASPECT_RATIO}
        minWidth={MIN_DIMENSION}
        // maxWidth={MIN_DIMENSION}
      >
        <img
          ref={imageRef}
          src={avatarImageURL}
          alt="crop_image"
          crossOrigin="anonymous"
          onLoad={onImageLoad}
          onError={imgErrorHandler}
          style={{
            maxHeight: "360px",
            maxWidth: "680px"
          }}
        />
      </ReactCrop>
      <div className="mt-2">
        <Button
          onClick={handleClickSave}
          disabled={src !== "" && !regex.test(src)}
          name={"Save"}
        />
      </div>
    </div>
  );
};
