import { groq } from "next-sanity";

const vehicleProjection = groq`
  _id,
  brand,
  model,
  "slug": slug.current,
  year,
  price,
  mileage,
  fuel,
  transmission,
  type,
  power,
  images,
  description,
  features,
  status,
  isFeatured,
  isNew,
  _createdAt,
  soldDate
`;

export const availableVehiclesQuery = groq`
  *[_type == "vehicle" && (status == "available" || status == "reserved")] | order(_createdAt desc) {
    ${vehicleProjection}
  }
`;

export const featuredVehiclesQuery = groq`
  *[_type == "vehicle" && (status == "available" || status == "reserved") && isFeatured == true] | order(_createdAt desc) [0...4] {
    ${vehicleProjection}
  }
`;

export const soldVehiclesQuery = groq`
  *[_type == "vehicle" && status == "sold"] | order(soldDate desc) {
    ${vehicleProjection}
  }
`;

export const vehicleBySlugQuery = groq`
  *[_type == "vehicle" && slug.current == $slug][0] {
    ${vehicleProjection}
  }
`;

export const allVehicleSlugsQuery = groq`
  *[_type == "vehicle" && defined(slug.current)] {
    "slug": slug.current
  }
`;
