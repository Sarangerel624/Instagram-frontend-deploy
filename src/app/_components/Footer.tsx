import { House } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";
export const Footer = () => {
  return (
    <div className="fixed bottom-0 bg-white w-screen flex justify-between px-8 py-2">
      <Link href="/">
        <House />
      </Link>
      <Link href="/search">
        <Search />
      </Link>
      <Link href="/create">
        <SquarePlus />
      </Link>
      <Link href="/idPost">
        <CircleUserRound />
      </Link>
    </div>
  );
};
