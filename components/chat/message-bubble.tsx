import { CheckCheckIcon } from "@/lib/icons"
import type { Message } from "@/lib/types"
import { formatTime } from "@/lib/date-utils"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  isGrouped?: boolean
}

export function MessageBubble({ message, isOwn, showAvatar = true, isGrouped = false }: MessageBubbleProps) {
  return (
    <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"} ${isGrouped ? "mt-0.5" : "mt-2"}`}>
      {!isOwn && showAvatar && !isGrouped && <div className="h-8 w-8" />}
      <div
        className={`relative max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
          isOwn ? "bg-whatsapp-green-light text-gray-900" : "bg-white text-gray-900"
        } ${isGrouped ? (isOwn ? "rounded-tr-sm" : "rounded-tl-sm") : ""}`}
      >
        {isOwn && <div className="absolute left-0 top-0 bottom-0 w-1 bg-whatsapp-green rounded-l-lg" />}
        <p className="break-words text-sm text-pretty leading-relaxed">{message.content}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[11px] text-gray-500">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <span className="text-gray-500">
              {message.read ? (
                <CheckCheckIcon className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <CheckCheckIcon className="h-3.5 w-3.5 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
