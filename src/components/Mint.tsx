"use client";
import Link from 'next/link';
import { useEffect, useState, useCallback } from "react";
import { Address, formatUnits } from "viem";
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

import Username from "./Username";

const directoryAddress = "0x646d7819bf2e8791c0F0957EE2123f70eA8d024A";
const directoryAbi = [{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"addFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Mint","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"onCreate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"onMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"removeFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getArt","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getArtMinters","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtMintersAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFactories","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getFactoryAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getNumArtMinters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumFactories","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserCreated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserCreated","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserCreatedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserMinted","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserMintedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserCreated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"isArt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"isFactory","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

const warpcashAddress = '0xfaF54aD35f00Dd40ce037E49223e0d1AdEef05B5';
const warpcashAbi = [{"inputs":[{"internalType":"bytes32","name":"root","type":"bytes32"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"ticker","type":"string"},{"internalType":"string","name":"icon","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"collect","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"setRecord","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint32","name":"pos","type":"uint32"}],"name":"checkpoints","outputs":[{"components":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint224","name":"votes","type":"uint224"}],"internalType":"structERC20Votes.Checkpoint","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getClaimedBalance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"addrs","type":"address[]"}],"name":"getClaimedBalances","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLooseRangeLPTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"getRecord","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStaker","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTightRangeLPTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"image","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"validKey","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"}];

const artAbi = [{"inputs":[{"internalType":"address","name":"directory","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"string","name":"tokenUri","type":"string"},{"internalType":"address","name":"tokenCreator","type":"address"},{"internalType":"uint256","name":"tokenPrice","type":"uint256"},{"internalType":"uint256","name":"copies","type":"uint256"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC20Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function Mint({ address }: { address: string }) {
  const { address: connectedAddress } = useAccount();

  const [minting, setMinting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheBust, setCacheBust] = useState<number>(1);

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

  useEffect(() => {
    if (writeError) {
      setMinting(false);
      setTimeout(() => setError(writeError.message.split('\n')[0]), 1);
    } else if (isConfirmed) {
      setMinting(false);
      setError('Minted!')
      setCacheBust(cacheBust + 1);
    }
  }, [writeError, isConfirmed]);

  const { data: priceRes } = useReadContract({
    abi: artAbi,
    address: address as Address,
    functionName: "price",
    args: [],
  });
  const price = (priceRes || 0n) as bigint;

  const { data: creatorRes } = useReadContract({
    abi: artAbi,
    address: address as Address,
    functionName: "creator",
    args: [],
  });
  const creator = (creatorRes || NULL_ADDRESS) as string;

  const { data: tokenUriRes } = useReadContract({
    abi: artAbi,
    address: address as Address,
    functionName: "tokenURI",
    args: [0],
  });
  const tokenUri = (tokenUriRes || "data:application/json;base64,e30=") as string;
  const metadata = JSON.parse(atob(tokenUri.split(',')[1]));

  const { data: mintersRes } = useReadContract({
    abi: directoryAbi,
    address: directoryAddress as Address,
    functionName: "getArtMinters",
    args: [address],
    scopeKey: `create-${cacheBust}`,
  });
  const [minters, /*timestamps*/] = (mintersRes || [[], []]) as [string[], bigint[]];

  const mint = () => {
    setError(null);
    setMinting(true);
    writeContract({
      abi: warpcashAbi,
      address: warpcashAddress,
      functionName: "safeTransferFrom",
      args: [connectedAddress, address, price],
      chainId: base.id,
    });
  };

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose?&embeds[]=" + window.location.href);
  }, []);

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

  console.log(creator);

  return (
    <div className="w-[300px] mx-auto py-4 px-2 mt-8">
      <img src={metadata.image} />
      <div className="flex items-start mt-4">
        <div className="flex-grow text-xl font-bold">{metadata.name}</div>
        <div className="flex-shrink text-l">
          <div>{formatUnits(price, 18)}₩</div>
        </div>
      </div>
      <div className="mb-4">
        {
          creator ? (
            <div>by <Username address={creator} /></div>
          ) : null
        }
      </div>
      <button type="button" className="claim-button" disabled={minting || price == 0n} onClick={mint}>
        {minting ? 'minting' : `Mint`}
      </button>
      <button type="button" className="secondary-button" style={{ marginTop: '.5em' }} onClick={openWarpcastUrl}>
        Share
      </button>
      { error ? (
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">{error}</pre>
          </div>
        </div>
      ) : null}
      <div className="mb-4">
        {
          minters.length > 0 ? (
            <div>
              <div className="flex-grow text-xl font-bold mt-8">Minted by:</div>
              {
                minters.map(m => (
                  <div key={m}><Username address={m} /></div>
                ))
              }
            </div>
          ) : null
        }
      </div>
    </div>
  )
}
