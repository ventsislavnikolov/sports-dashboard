import { useState } from "react";

interface PlayerAvatarProps {
  name: string;
  photo: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PlayerAvatar({ name, photo, size = 24 }: PlayerAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !photo) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-bg-hover font-semibold text-text-muted"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      alt={name}
      className="rounded-full object-cover"
      onError={() => setImgError(true)}
      src={photo}
      style={{ width: size, height: size }}
    />
  );
}
