import Image from "next/image";
import { getUser } from "@/lib/store";

export function AvatarStack({
  userIds,
  max = 4,
  size = 28,
}: {
  userIds: string[];
  max?: number;
  size?: number;
}) {
  const shown = userIds.slice(0, max);
  const overflow = userIds.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((id) => {
        const u = getUser(id);
        if (!u) return null;
        return (
          <img
            key={id}
            src={u.avatarUrl}
            alt={u.name}
            width={size}
            height={size}
            className="avatar"
            style={{ width: size, height: size }}
          />
        );
      })}
      {overflow > 0 && (
        <div
          className="rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-xs font-medium"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

export function Avatar({ userId, size = 40, withName }: { userId: string; size?: number; withName?: boolean }) {
  const u = getUser(userId);
  if (!u) return null;
  return (
    <div className="flex flex-col items-center">
      <img src={u.avatarUrl} alt={u.name} className="avatar" style={{ width: size, height: size }} />
      {withName && <span className="mt-1 text-sm text-white/85">{u.name.split(" ")[0]}</span>}
    </div>
  );
}
