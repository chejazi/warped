import { ImageResponse } from "next/og";

export const alt = "Warped Art Marketplace";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-start items-start relative" style={{ backgroundColor: '#1300ff', color: '#ffffff' }}>
        <img src="https://warped.vercel.app/splash.png" style={{ width: '150px', height: '150px' }} />
        <div tw="flex flex-col">
          <div tw="text-6xl ml-10 mb-5">Warped</div>
          <div tw="text-2xl ml-10">Create NFTs from a frame</div>
          <div tw="text-2xl ml-10">Collect NFTs in the feed</div>
          <div tw="text-xl ml-10 italic">+ Warpcash airdrop live</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
