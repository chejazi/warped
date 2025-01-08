import { Metadata } from "next";
import axios from "axios";
import Mint from "~/components/Mint";

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://warped.art';

interface Props {
  params: Promise<{
    name: string;
  }>;
}
async function getMetadata(address: string) {
  const response = await axios.get(
    'https://sap5mmohmda4xyj7evr7xhissi0eboei.lambda-url.us-east-1.on.aws/?address=' + address
  );
  if (response && response.data && !response.data.code) {
    return response.data;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const metadata = await getMetadata(name);
  const frame = {
    version: "next",
    imageUrl: metadata.image,
    button: {
      title: `Mint`,
      action: {
        type: "launch_frame",
        name: 'Mint',
        url: `${appUrl}/mint/${name}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#1300ff",
      },
    },
  };

  return {
    title: metadata.name,
    description: metadata.description,
    openGraph: {
      title: metadata.name,
      description: metadata.description,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function MintPage({ params }: Props) {
  const { name } = await params;
  return <Mint address={name} />;
}
