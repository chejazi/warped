"use client";
import Link from 'next/link';
import { useEffect, useCallback, useState } from "react";
import sdk, {
  FrameNotificationDetails,
  type FrameContext,
} from "@farcaster/frame-sdk";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
  useReadContract,
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base } from "wagmi/chains";
import { Address, BaseError, UserRejectedRequestError } from "viem";

import MintTile from "./MintTile";

const directoryAddress = "0x646d7819bf2e8791c0F0957EE2123f70eA8d024A";
const directoryAbi = [{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"addFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Create","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"art","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Mint","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"onCreate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"onMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"removeFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getArt","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getArtMinters","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getArtMintersAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFactories","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getFactoryAt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"getNumArtMinters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNumFactories","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserCreated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNumUserMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserCreated","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserCreatedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserMinted","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUserMintedAt","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserCreated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"art","type":"address"}],"name":"hasUserMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"art","type":"address"}],"name":"isArt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"factory","type":"address"}],"name":"isFactory","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

export default function Home(
  { title }: { title?: string } = { title: "Warped" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);

  const [addFrameResult, setAddFrameResult] = useState("");
  const [sendNotificationResult, setSendNotificationResult] = useState("");

  const [pages, setPages] = useState(1);

  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
  }, [context]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  const {
    switchChain,
    error: switchChainError,
    isError: isSwitchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();

  const handleSwitchChain = useCallback(() => {
    switchChain({ chainId: base.id });
  }, [switchChain]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      setAdded(context.client.added);

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
        if (notificationDetails) {
          setNotificationDetails(notificationDetails);
        }
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log(reason);
      });

      sdk.on("frameRemoved", () => {
        setAdded(false);
        setNotificationDetails(null);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        setNotificationDetails(notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        setNotificationDetails(null);
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

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

  // const fid = context && context.user && context.user.fid;
  const frameAdded = context && context.user && context.client && context.client.added;

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  const addFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);

      const result = await sdk.actions.addFrame();

      if (result.added) {
        if (result.notificationDetails) {
          setNotificationDetails(result.notificationDetails);
        }
        setAddFrameResult(
          result.notificationDetails
            ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
            : "Added, got no notification details"
        );
      } else {
        setAddFrameResult(`Not added: ${result.reason}`);
      }
    } catch (error) {
      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  const { data: numCreatedRes } = useReadContract({
    abi: directoryAbi,
    address: directoryAddress as Address,
    functionName: "getNumArt",
    args: [],
  });
  const numCreated = Number(numCreatedRes || 0);

  const indices = [];
  const max = Math.min(10 * pages, numCreated);
  for (let i = numCreated; i > numCreated - max; i--) {
    indices.push(i - 1);
  }

  console.log(numCreated, max, indices)

  const sendNotification = useCallback(async () => {
    setSendNotificationResult("");
    if (!notificationDetails || !context) {
      return;
    }

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        mode: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: context.user.fid,
          notificationDetails,
        }),
      });

      if (response.status === 200) {
        setSendNotificationResult("Success");
        return;
      } else if (response.status === 429) {
        setSendNotificationResult("Rate limited");
        return;
      }

      const data = await response.text();
      setSendNotificationResult(`Error: ${data}`);
    } catch (error) {
      setSendNotificationResult(`Error: ${error}`);
    }
  }, [context, notificationDetails]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

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
    <div className="w-[300px] mx-auto py-4">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      <div className="mb-4">
        <br />
        <h1 className="font-4xl font-bold mb-4">Welcome 👋</h1>
        <p className="mb-4">Warped is an NFT marketplace that lives on Farcaster</p>
        <Link href="/create">
          <button type="button" className="claim-button mt-2">
            Create NFT
          </button>
        </Link>
        <button type="button" className="secondary-button mt-2" disabled={frameAdded} onClick={addFrame}>
          {frameAdded ? 'Frame Added' : 'Add Frame'}
        </button>
        { addFrameResult ? (
          <div className="mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">{addFrameResult}</pre>
            </div>
          </div>
        ) : null}
      </div>
      <br />
      <h1 className="font-4xl font-bold mb-4">Warpcash (₩)</h1>
      <p className="mb-4">NFTs can be purchased in-feed using Warpcash, a currency launched for all Farcaster users on December 30</p>
      {
        indices.map(i => (
          <MintTile key={`tile-${i}`} artIndex={i} />
        ))
      }
      <button type="button" className="secondary-button mt-2 mb-10" disabled={numCreated == indices.length} onClick={() => setPages(pages + 1)}>
        Load more
      </button>
      <div style={{ display: 'none' }}>
        <div>
          <h2 className="font-2xl font-bold">Actions</h2>
          <div className="mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                sdk.actions.openUrl
              </pre>
            </div>
            <Button onClick={openWarpcastUrl}>Open Warpcast Link</Button>
          </div>
        </div>
        <div>
          <h2 className="font-2xl font-bold">Add to client & notifications</h2>

          <div className="mt-2 mb-4 text-sm">
            Client fid {context?.client.clientFid},
            {added ? " frame added to client," : " frame not added to client,"}
            {notificationDetails
              ? " notifications enabled"
              : " notifications disabled"}
          </div>

          <div className="mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
              <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
                sdk.actions.addFrame
              </pre>
            </div>
            {addFrameResult && (
              <div className="mb-2 text-sm">
                Add frame result: {addFrameResult}
              </div>
            )}
            <Button onClick={addFrame} disabled={added}>
              Add frame to client
            </Button>
          </div>

          {sendNotificationResult && (
            <div className="mb-2 text-sm">
              Send notification result: {sendNotificationResult}
            </div>
          )}
          <div className="mb-4">
            <Button onClick={sendNotification} disabled={!notificationDetails}>
              Send notification
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-2xl font-bold">Wallet</h2>

          {address && (
            <div className="my-2 text-xs">
              Address: <pre className="inline">{truncateAddress(address)}</pre>
            </div>
          )}

          {chainId && (
            <div className="my-2 text-xs">
              Chain ID: <pre className="inline">{chainId}</pre>
            </div>
          )}

          <div className="mb-4">
            <Button
              onClick={() =>
                isConnected
                  ? disconnect()
                  : connect({ connector: config.connectors[0] })
              }
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
          <div className="mb-4">
            <Button
              onClick={handleSwitchChain}
              disabled={isSwitchChainPending}
              isLoading={isSwitchChainPending}
            >
              Connect to Base
            </Button>
            {isSwitchChainError && renderError(switchChainError)}
          </div>
        </div>
      </div>
    </div>
  );
}

const renderError = (error: Error | null) => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      (e) => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className="text-red-500 text-xs mt-1">Rejected by user.</div>;
    }
  }

  return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
};
