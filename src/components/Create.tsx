"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Address, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { base } from "wagmi/chains";

import sdk, {
  type FrameContext,
} from "@farcaster/frame-sdk";

const factoryAddress = "0xb93a276b4bE85C7b8F6aE5A2538564aa7029C954";
const factoryAbi = [{"inputs":[{"internalType":"address","name":"directory","type":"address"},{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"uint256","name":"pricePerToken","type":"uint256"},{"internalType":"uint256","name":"ownerCopies","type":"uint256"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTemplate","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newTemplate","type":"address"}],"name":"updateTemplate","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const directoryAddress = "0x646d7819bf2e8791c0F0957EE2123f70eA8d024A";
const directoryAbi = [{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"addFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Mint","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"onCreate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"onMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"removeFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getArt","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getArtMinters","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtMintersAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFactories","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getFactoryAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getNumArtMinters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumFactories","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserCreated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserCreated","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserCreatedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserMinted","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserMintedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserCreated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"isArt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"isFactory","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface StringMap {
  [key: string]: string;
}

function jsonToBase64Url(jsonObject: StringMap) {
  // Step 1: Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject);

  // Step 2: Encode to Base64
  const base64 = btoa(jsonString);

  // Step 4: Add the `data:` prefix for JSON
  const dataUrl = `data:application/json;base64,${base64}`;

  return dataUrl;
}

export const generatePinataKey = async () => {
  try {
    const tempKey = await fetch(`https://yhc7kft5ufqlgkunuroq2f32vy0jtifg.lambda-url.us-east-1.on.aws`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    const keyData = await tempKey.json();
    return keyData.results;
  } catch (error) {
    console.log("error making API key:", error);
    throw error;
  }
};

export async function deleteKey(keyId: string) {
  try {
    const deleteKey = await fetch(`https://4kpcvmruqh2aeulgopcwpchdry0wnfcu.lambda-url.us-east-1.on.aws?keyId=${keyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const deleteJson = await deleteKey.json();
    console.log(deleteJson);
  } catch (error) {
    console.log("Error deleting API key:", error);
  }
}

export default function Create() {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  const [price, setPrice] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheBust, setCacheBust] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const { writeContract, error: writeError, data: writeData } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      setSelectedFile(target.files[0]);
      setPreview(URL.createObjectURL(target.files[0]));
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleSubmission = async () => {
    if (!selectedFile) {
      throw new Error('No media selected');
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);
    const keyData = await generatePinataKey();
    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keyData.JWT}`,
        },
        body: formData,
      }
    );
    const resData = await res.json();
    console.log(resData);
    return resData.IpfsHash;
  };

  useEffect(() => {
    if (writeError) {
      setCreating(false);
      setTimeout(() => setError(writeError.message.split('\n')[0]), 1);
    } else if (isConfirmed) {
      setCreating(false);
      setCacheBust(cacheBust + 1);
    }
  }, [writeError, isConfirmed]);

  const { data: numUserCreatedRes } = useReadContract({
    abi: directoryAbi,
    address: directoryAddress as Address,
    functionName: "getNumUserCreated",
    args: [connectedAddress],
    scopeKey: `create-${cacheBust}`,
  });
  const numCreated = Number(numUserCreatedRes || -1);

  const { data: userCreatedAtRes } = useReadContract({
    abi: directoryAbi,
    address: directoryAddress as Address,
    functionName: "getUserCreatedAt",
    args: [connectedAddress, numCreated - 1],
    scopeKey: `create-${cacheBust}`,
  });
  const [art, /*timestamp*/] = (userCreatedAtRes || [NULL_ADDRESS, 0n]) as [string, bigint];

  useEffect(() => {
    if (art != NULL_ADDRESS && isConfirmed) {
      router.push(`/mint/${art}`);
    }
  }, [art, isConfirmed]);

  const create = async () => {
    setError(null);
    setCreating(true);
    let name = null;
    let symbol = null;
    let uri = null;
    let cost = null
    try {
      if (title.replace(/\s+/g, '').length == 0) {
        throw new Error('Please add a title');
      }
      name = title.trim();
      symbol = (context && context.user && context.user.username) || 'NFT';
      cost = parseEther(price.length > 0 ? price : '10');
      const hash = await handleSubmission();
      const image = `https://ipfs.io/ipfs/${hash}`;
      uri = jsonToBase64Url({
        name,
        description,
        image,
      });
      console.log('image', image);
      console.log('uri', uri);
    } catch (e) {
      setError((e as Error).message);
      console.log('error', e);
      setCreating(false);
      return;
    }
    writeContract({
      abi: factoryAbi,
      address: factoryAddress,
      functionName: "create",
      args: [
        name,
        symbol,
        uri,
        cost,
        0
      ],
      chainId: base.id,
    });
  };

  if (!context) {
    return (
      <div className="w-[300px] mx-auto py-4 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">Warped</h1>
        <p className="mb-4">Warped currently only works within Farcaster. View it here: </p>
        <Link href="https://warpcast.com/kompreni/0x02c9d7b5">
          Warped
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4 mt-4">Create an NFT</h1>
      <div className="mb-4 mt-8">
        <div>
          <input
            type="file"
            accept=".png, .gif, .jpg, .jpeg, .mp4, .webm"
            onChange={changeHandler}
          />
          {
            preview &&
            <img alt="preview image" src={preview} className="mt-4" />
          }
        </div>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="text-input" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="text-input" />
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (default 10 $WARPCASH)" className="text-input" />
        <br />
      </div>
      <button className="claim-button mt-2" disabled={creating} onClick={create}>{creating ? 'Posting' : 'Post'}</button>
      { error ? (
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">{error}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
