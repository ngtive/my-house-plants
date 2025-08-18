import {
  pgTable,
  integer,
  doublePrecision,
  timestamp,
  index,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const distanceRecords = pgTable("distance-records", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "distance-records_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
  }),
  distance: doublePrecision().notNull(),
  percentage: doublePrecision().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "users_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name"),
    username: varchar(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    telegramId: bigint("telegram_id", { mode: "number" })
      .notNull()
      .unique("telegram_id_unique"),
  },
  (table) => [
    index("telegram_id_idx").using(
      "btree",
      table.telegramId.asc().nullsLast().op("int8_ops"),
    ),
  ],
);
