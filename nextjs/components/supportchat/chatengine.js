import React from 'react'
import { ChatEngineWrapper, Socket, ChatFeed } from 'react-chat-engine'

export default function ChatEngine(prop) {
  return (
    <>
      <ChatEngineWrapper>
        <Socket
          projectID={`
          f63f7062-764b-4d04-8a3b-ac4789fa67d9`}
          userName={prop.user.username}
          userSecret={prop.user.username}
        />
        <ChatFeed activeChat={prop.chat.id} />
      </ChatEngineWrapper>
    </>
  )
}
