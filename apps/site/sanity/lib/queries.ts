import { groq } from "next-sanity";

// Photos : le strict nécessaire. L'_id suffit pour construire l'URL, les dimensions servent au
// plein écran ; _key, _type, url et aspectRatio alourdissaient chaque liste sans servir.
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
  "images": images[defined(asset._ref)]{
    asset->{
      _id,
      metadata { lqip, "dimensions": dimensions { width, height } }
    }
  },
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
  *[_type == "vehicle" && (status == "available" || status == "reserved") && isFeatured == true] | order(_createdAt desc) [0...12] {
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
