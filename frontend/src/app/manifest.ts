import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartMove",
    short_name: "SmartMove",
    theme_color: "#eee",
    background_color: "#1F0F50",
    display: "fullscreen",
    orientation: "natural",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/images/icons-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/images/icons-256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "/images/icons-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
