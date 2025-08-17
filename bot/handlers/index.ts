import { Effect } from "effect";
import { Update } from "@telegraf/types";
import { db } from "@/db";
import { users } from "@/db/schema";

const checkIfUserExists = (update: Update.MessageUpdate) => {};

const handleRegisterUser = (update: Update.MessageUpdate) => {
  return Effect.gen(function* () {
    const telegram_id = update.message.from.id as unknown as bigint;

    db.insert(users).values({
      first_name: update.message.from.first_name,
      last_name: update.message.from.last_name,
      username: update.message.from.username,
      telegram_id: telegram_id,
    });
  });
};
