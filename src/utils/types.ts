import { UseWalletReturnInterface } from "../controllers/useWallet/useWallet";
import { type Crop } from "react-image-crop";

export interface LocalData {
  id: number;
  dateOfBirth: string;
  biography: string;
  dateOfDeath: string;
  name: string;
  photoUrl: string[];
  parents: number[];
  partners: number[];
  avatarParams: {
    width: number;
    height: number;
    crop: Crop;
  };
  x: number;
  y: number;
  v: number;
}

export interface ContractData {
  id: number;
  bd: string;
  d: string;
  dd: string;
  n: string;
  p: number[];
  ps: number[];
  u?: string[];
  x: number;
  y: number;
  v: number;
}


type FamylyNodeWithCoords = ContractData & { x: number, y: number }

export interface LinkInterface {
  relationship: "Partner" | "Sibling" | "Child";
  source: FamylyNodeWithCoords;
  target: FamylyNodeWithCoords;
}

export interface GetAvatarImageArguments {
  image: string;
  width: number;
  height: number;
  crop: Crop;
}

export type SocialMediaTitles = "X" | "telegram" | "facebook" | "instagram" | "youtube";

export type WalletContextType = UseWalletReturnInterface & LocalCacheChangedType;
type LocalCacheChangedType = {
  localCacheChanged: boolean;
  setLocalCacheChanged: React.Dispatch<React.SetStateAction<boolean>>;
}