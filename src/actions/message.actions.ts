"use server";

import { Message } from "@/db/dummy";
import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type SendMessageActionProps = {
  content: string;
  messageType: "text" | "image";
  receiverId: string;
};
export async function sendMessageAction({
  content,
  messageType,
  receiverId,
}: SendMessageActionProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false, message: "user not Authenticated" };
  const senderId = user.id;
  const conversationId = `conversation:${[senderId, receiverId]
    .sort()
    .join(":")}`;

  // john, jane
  // 123,  456

  // john sends a message to jane
  // senderId: 123, receiverId: 456
  // `conversation:123:456`

  // jane sends a message to john
  // senderId: 456, receiverId: 123
  // conversation:456:123

  const conversationExists = await redis.exists(conversationId);
  if (!conversationExists) {
    await redis.hset(conversationId, {
      participant1: senderId,
      participant2: receiverId,
    });
    await redis.sadd(`user:${senderId}:conversations`, conversationId);
    await redis.sadd(`user:${receiverId}:conversations`, conversationId);
  }
  // generate a unique id for the message
  const messageId = `message:${Date.now()}:${Math.random()
    .toString(36)
    .substring(2, 9)}`;
  const timestamp = Date.now();
  // create the messsage hash
  await redis.hset(messageId, { senderId, content, timestamp, messageType });

  await redis.zadd(`${conversationId}:messages`, {
    score: timestamp,
    member: JSON.stringify(messageId),
  });
  return { success: true };
}

export async function getMessages(selectedUserId: string, currentUserId: string) {
	// conversation:kp_87f4a115d5f34587940cdee58885a58b:kp_a6bc2324e26548fcb5c19798f6459814:messages

	const conversationId = `conversation:${[selectedUserId, currentUserId].sort().join(":")}`;
	const messageIds = await redis.zrange(`${conversationId}:messages`, 0, -1);

	if (messageIds.length === 0) return [];

	const pipeline = redis.pipeline();
	messageIds.forEach((messageId) => pipeline.hgetall(messageId as string));
	const messages = (await pipeline.exec()) as Message[];

	return messages;
}
