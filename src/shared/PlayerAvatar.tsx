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
        className="rounded-full bg-bg-hover flex items-center justify-center text-text-muted font-semibold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={name}
      onError={() => setImgError(true)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
