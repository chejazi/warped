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
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
import AirdropClaim from "./AirdropClaim";

export default function Demo(
  { title }: { title?: string } = { title: "Frames v3 Demo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [addresses, setAddresses] = useState<string[]>([]);

  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);

  const [addFrameResult, setAddFrameResult] = useState("");
  const [sendNotificationResult, setSendNotificationResult] = useState("");

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

  const fid = context && context.user && context.user.fid;
  console.log(context);

  useEffect(() => {
    if (fid) {
      fetch('https://6mhpn3thp4knudawjrha54hlxa0ovzsy.lambda-url.us-east-1.on.aws/?fid='+fid)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON from the response
      })
      .then(jsonData => {
        const ethAddresses = jsonData.users[0].verified_addresses.eth_addresses;
        setAddresses(ethAddresses);
      })
      .catch(e => console.log("ERROR", e));
    }
  }, [fid])

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  // const close = useCallback(() => {
  //   sdk.actions.close();
  // }, []);

  console.log(sdk.actions);

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
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      <div className="mb-4">
        <h2 className="font-2xl font-bold mt-4" style={{ textAlign: "center" }}>Warpcash for @{context.user.username}</h2>
        <br />
        {
          addresses.map(a => (
            <AirdropClaim address={a} key={`claim-${a}`} />
          ))
        }
        <p className="mt-4 mb-4">Addresses that held more ETH on Base and Mainnet at the time of the snapshot can claim more Warpcash</p>
      </div>
      <div className="mb-4">
        Contract<br />
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            0xfaF54aD35f00Dd40ce037E49223e0d1AdEef05B5
          </pre>
        </div>
      </div>
      <div className="mb-4">
        Supply<br />
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            {(1000000000).toLocaleString()} $WARPCASH
            <ul className="mt-2" style={{ listStyleType: 'initial', marginLeft: '1em' }}>
              <li>42.069% airdropped on Farcaster</li>
              <li>50% locked in Uniswap pool</li>
              <li>7% LP incentives on Rebase</li>
              <li>&lt;1% to the superteam</li>
            </ul>
          </pre>
        </div>
      </div>
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
