import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

class UserService {
  async createUser(
    telegram_id: bigint,
    first_name: string,
    last_name?: string,
    username?: string,
  ) {
    return db
      .insert(users)
      .values({
        telegram_id: telegram_id,
        first_name: first_name,
        last_name: last_name,
        username: username,
      })
      .returning();
  }
  async deleteUser(telegram_id: bigint) {
    return db
      .delete(users)
      .where(eq(users.telegram_id, telegram_id))
      .returning();
  }

  async userUpdateInteraction(telegram_id: bigint) {
    await db
      .update(users)
      .set({
        last_interaction: new Date(),
      })
      .where(eq(users.telegram_id, telegram_id));
  }
}

export default new UserService();
