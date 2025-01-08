import { useEffect, useState } from "react";
import { Address } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { base } from "wagmi/chains";
const warpcashAddress = '0xfaF54aD35f00Dd40ce037E49223e0d1AdEef05B5';
const warpcashAbi = [{"inputs":[{"internalType":"bytes32","name":"root","type":"bytes32"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"ticker","type":"string"},{"internalType":"string","name":"icon","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint32","name":"pos","type":"uint32"}],"name":"checkpoints","outputs":[{"components":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint224","name":"votes","type":"uint224"}],"internalType":"structERC20Votes.Checkpoint","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"collect","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"getClaimedBalance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"addrs","type":"address[]"}],"name":"getClaimedBalances","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLooseRangeLPTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"getRecord","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStaker","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTightRangeLPTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"image","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"setRecord","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"validKey","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"}];
const prettyPrintAddress = (address: string) => `${address.substr(0, 6)}...${address.substr(-4)}`;

export default function AirdropClaim({ address }: { address: string }) {
  const { address: connectedAddress } = useAccount();

  const [amount, setAmount] = useState<number>(0);
  const [proof, setProof] = useState<string[]>([]);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheBust, setCacheBust] = useState<number>(1);

  const { writeContract, error: writeError, data: writeData } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  useEffect(() => {
    if (writeError) {
      setClaiming(false);
      setTimeout(() => setError(writeError.message.split('\n')[0]), 1);
    } else if (isConfirmed) {
      setClaiming(false);
      setCacheBust(cacheBust + 1);
    }
  }, [writeError, isConfirmed]);

  useEffect(() => {
    fetch('https://62ftzpzusnchbedo2yy7znrlye0wcnkw.lambda-url.us-east-1.on.aws?address=' + address.toLowerCase())
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then(jsonData => {
      if (jsonData.results.amount) {
        setAmount(jsonData.results.amount);
        setProof(jsonData.results.proof);
      }
    });
  }, []);

  const { data: hasClaimed } = useReadContract({
    abi: warpcashAbi,
    address: warpcashAddress as Address,
    functionName: "getClaimedBalance",
    args: [address],
    scopeKey: `claim-${cacheBust}`,
  });

  const claim = () => {
    setError(null);
    if (connectedAddress && connectedAddress.toLowerCase() != address.toLowerCase()) {
      setError(`Please connect address: ${address}`);
      return;
    }
    setClaiming(true);
    writeContract({
      abi: warpcashAbi,
      address: warpcashAddress,
      functionName: "claim",
      args: [proof, address, amount],
      chainId: base.id,
    });
  };

  if (!amount) {
    return (
      <div className="flex" style={{ alignItems: 'center', marginTop: '1em', fontStyle: 'italic' }}>loading...</div>
    );
  }
  return (
    <div>
      <div className="flex" style={{ alignItems: 'center', marginTop: '1em', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '.75em' }}>For {prettyPrintAddress(address)}: </div>
        {hasClaimed ? (
          <button type="button" className="claim-button" disabled>
            {`Claimed ${amount.toLocaleString()} ₩`}
          </button>
        ) : (
          <button type="button" className="claim-button" disabled={claiming} onClick={claim}>
            {claiming ? 'claiming' : `Claim ${amount.toLocaleString()} ₩`}
          </button>
        )}
      </div>
      { error ? (
        <div className="mb-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">{error}</pre>
          </div>
        </div>
      ) : null}
    </div>
  )
}