import { useState, useCallback, useEffect } from 'react'
import { MESSAGES } from '../data/listings'
import { getRegisteredUsers } from '../store/authStore'
import { useAuth } from './useAuth'

const CHATS_KEY = 'dealx_user_chats'

function loadChats() {
  try {
    const savedChats = JSON.parse(localStorage.getItem(CHATS_KEY) || '{}')
    return Object.fromEntries(Object.entries(savedChats).map(([chatId, messages]) => [
      chatId,
      Array.isArray(messages) ? messages.filter(message => message.text !== 'test') : [],
    ]))
  } catch {
    return {}
  }
}

function getChatId(firstUserId, secondUserId) {
  return [String(firstUserId), String(secondUserId)].sort().join(':')
}

function getChatKey(currentUserId, contact) {
  if (contact.type === 'bot') return `bot:${currentUserId}:${contact.id}`
  if (contact.type === 'seller') return `seller:${currentUserId}:${contact.id}`
  return `user:${getChatId(currentUserId, contact.id)}`
}

function getInitialMessages(contact) {
  if (contact.type !== 'bot') return []
  return [{
    id: `initial-${contact.id}`,
    senderId: `bot-${contact.id}`,
    text: contact.text,
    time: contact.time,
    readBy: [],
  }]
}

function nowTime() {
  return new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

export function useMessages() {
  const { user } = useAuth()
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState(loadChats)
  const [input, setInput] = useState('')
  const contacts = [
    ...MESSAGES.map(message => ({ ...message, type: 'bot' })),
    ...getRegisteredUsers().filter(account => account.id !== user?.id).map(account => ({ ...account, type: 'user' })),
  ]

  const getMessages = useCallback((contact) => {
    if (!user) return []
    return chats[getChatKey(user.id, contact)] || getInitialMessages(contact)
  }, [chats, user])

  const getUnreadCount = useCallback((contact) => (
    getMessages(contact).filter(message => message.senderId !== user?.id && !message.readBy?.includes(user?.id)).length
  ), [getMessages, user])

  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
  }, [chats])

  // позначати повідомлення як прочитані під час відкриття чату
  useEffect(() => {
    if (!activeChat || !user) return
    const chatId = getChatKey(user.id, activeChat)
    setChats(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || getInitialMessages(activeChat)).map(message => (
        message.senderId === user.id || message.readBy?.includes(user.id)
          ? message
          : { ...message, readBy: [...(message.readBy || []), user.id] }
      )),
    }))
  }, [activeChat, user])

  const sendMessage = useCallback((text) => {
    if (!text.trim() || !activeChat || !user) return
    const chatId = getChatKey(user.id, activeChat)
    const newMsg = { id: `${Date.now()}-${user.id}`, senderId: user.id, text: text.trim(), time: nowTime(), readBy: [user.id] }
    setChats(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || getInitialMessages(activeChat)), newMsg],
    }))
    setInput('')
  }, [activeChat, user])

  const openChat = useCallback((contact) => setActiveChat(contact), [])
  const closeChat = useCallback(() => setActiveChat(null), [])

  const unreadCount = contacts.reduce((count, contact) => count + getUnreadCount(contact), 0)

  return {
    contacts,
    activeChat, openChat, closeChat,
    input, setInput,
    sendMessage,
    getMessages,
    getUnreadCount,
    unreadCount,
  }
}
