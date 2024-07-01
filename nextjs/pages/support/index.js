import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
export default function SupportChatAdmin() {
  const ChatEngine = dynamic(() =>
    import('react-chat-engine').then((module) => module.ChatEngine)
  )

  return (
    <ChatEngine
      projectID="f63f7062-764b-4d04-8a3b-ac4789fa67d9"
      userName="Baseball_Support"
      userSecret="123456"
      height="calc(100vh - 200px)"
    />
  )
}
