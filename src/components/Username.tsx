import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const prettyPrintAddress = (address: string) => `${address.substr(0, 6)}...${address.substr(-4)}`;

interface PassportSocial {
  source: string;
  profile_name: string;
  profile_bio: string;
  profile_image_url: string;
  profile_url: string;
  follower_count: number;
  following_count: number;
  passport_id: number;
}

interface PassportUserResponse {
  passport: {
    score: number;
    passport_id: number;
    passport_socials: PassportSocial[];
  }
}

async function address2FC(address: string) {
  const response = await axios.get(
    'https://4dclrhwmykkwtfebciminde34y0oyibh.lambda-url.us-east-1.on.aws/?address=' + address
  );
  if (response && response.data && !response.data.code) {
    const res = response.data as PassportUserResponse;
    const user = res.passport.passport_socials.filter((s: PassportSocial) => s.source == 'farcaster')?.[0];
    if (user) {
      return user.profile_name;
    }
  }
}

function Username({ address, link, both }: { address: string, link?: boolean, both?: boolean }) {
  const [username, setUsername] = useState<string|null>('');

  useEffect(() => {
    if (address && address != '0x0000000000000000000000000000000000000000') {
      address2FC(address).then(u => {
        if (u) {
          setUsername(u as string);
        }
      });
    }
  }, [address]);

  let handleElt = null;
  if (username) {
    handleElt = (
      <span>
        {username}
        <Link href={`https://warpcast.com/${username}`}>
          <img
            src="/fc.svg"
            style={{ height: '1em', marginLeft: '.25em', cursor: 'pointer', display: 'inline-block' }}
          />
        </Link>
      </span>
    );
  }
  let addressElt = <span>{prettyPrintAddress(address)}</span>;

  if (link) {
    if (handleElt) {
      handleElt = (<Link href={`https://warpcast.com/${username}`} target="_blank" style={{ marginRight: '.5em' }}>{handleElt}</Link>);
    }
    addressElt = (<Link href={`https://basescan.org/address/${address}`} target="_blank">{addressElt}</Link>)
  }
  if (both) {
    return <span>{handleElt}<span className="secondary-text">{addressElt}</span></span>
  }  else {
    return handleElt || addressElt;
  }
}

export default Username;
