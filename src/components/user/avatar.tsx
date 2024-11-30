"use client";

import { type User } from "next-auth";

import {
  AvatarFallback,
  AvatarImage,
  Avatar as RootAvatar,
} from "~/components/ui/avatar";

interface AvatarProps {
  user: User;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
  const profileName = (user.name ?? "Player").split(" ");
  const profileInitials =
    profileName.length > 1
      ? `${profileName[0]?.charAt(0)}${profileName[1]?.charAt(0)}`
      : profileName[0]?.charAt(0);

  return (
    <RootAvatar className={className}>
      <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
      <AvatarFallback className="box-border border bg-slate-200">
        {profileInitials}
      </AvatarFallback>
    </RootAvatar>
  );
};

interface PlaceHolderAvatarProps {
  text: string;
  className?: string;
}

export const PlaceHolderAvatar: React.FC<PlaceHolderAvatarProps> = ({
  text,
  className,
}) => (
  <RootAvatar className={className}>
    <AvatarFallback className="box-border border bg-white">
      {text}
    </AvatarFallback>
  </RootAvatar>
);

export default Avatar;
