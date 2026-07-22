import { getDatabase, ref, get, set, update } from "firebase/database";

const rtdb = getDatabase();

export async function getOrCreateChat(currentUid, otherUid) {
  const chatId =
    currentUid < otherUid
      ? `${currentUid}_${otherUid}`
      : `${otherUid}_${currentUid}`;

  const chatRef = ref(rtdb, `chats/${chatId}`);
  const snap = await get(chatRef);

  if (!snap.exists()) {
    await set(chatRef, {
      createdAt: Date.now(),
      messages: {},
    });
  }

  await update(ref(rtdb, `user_chats/${currentUid}/${chatId}`), {
    withUid: otherUid,
    lastMessage: "",
    lastTimestamp: Date.now(),
  });

  await update(ref(rtdb, `user_chats/${otherUid}/${chatId}`), {
    withUid: currentUid,
    lastMessage: "",
    lastTimestamp: Date.now(),
  });

  return chatId;
}
