// Liens réseaux sociaux ForeverCars
export const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/4evercars_/", handle: "@4evercars_" },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61552718155111",
    handle: "ForeverCars",
  },
  { name: "TikTok", href: "https://www.tiktok.com/@forerver.cars", handle: "@forerver.cars" },
] as const;

export type SocialName = (typeof socialLinks)[number]["name"];
