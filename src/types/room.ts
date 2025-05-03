import { Timestamp } from "firebase/firestore";
import { Amenity } from "./amenity";

type Images = {
  id: string;
  url: string;
}

export type Room= {
  id: string;
  id_property: string;
  title: string;
  location: string;
  url_map: string;
  thumbnail: string;
  price: number;
  furnished: boolean;
  roommates: number;
  images: Images[];
  available: boolean;
  date_availability: Timestamp;
  private_washroom: boolean;
  description: string;
  specific_amenities: Amenity[]
}