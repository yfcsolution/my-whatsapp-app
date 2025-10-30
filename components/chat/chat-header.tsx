import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical, Phone, Video, Search } from "lucide-react"
import type { User } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ChatHeaderProps {
  user: User
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b bg-gray-50 px-4 py-2.5">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        {user.status === "online" && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-whatsapp-green" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-balance truncate">{user.name}</h2>
        <p className="text-xs text-gray-500 truncate">
          {user.status === "online"
            ? "online"
            : user.lastSeen
            ? `last seen ${formatDistanceToNow(user.lastSeen, { addSuffix: true })}`
            : "offline"}
        </p>
      </div>
      <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors">
        <Video className="h-5 w-5" />
      </button>
      <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors">
        <Phone className="h-5 w-5" />
      </button>
      <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors">
        <Search className="h-5 w-5" />
      </button>
      <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  )
}