import { Metadata } from "next";

import Create from "~/components/Create";

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://warped.art';

const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "Launch",
    action: {
      type: "launch_frame",
      name: "Warped",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#1300ff",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Warped",
    openGraph: {
      title: "Warped",
      description: "Farcaster-native NFT marketplace",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function CreatePage() {
  return (
    <Create />
  );
}
