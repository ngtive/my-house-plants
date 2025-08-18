import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
  bigint,
  index,
} from "drizzle-orm/pg-core";

export const records = pgTable("distance-records", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  distance: doublePrecision().notNull(),
  percentage: doublePrecision().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().$onUpdate(() => new Date()),
});

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    telegram_id: bigint({ mode: "bigint" }).notNull(),
    first_name: varchar().notNull(),
    last_name: varchar(),
    username: varchar(),
    last_interaction: timestamp().defaultNow(),
  },
  (table) => [index("telegram_id_idx").on(table.telegram_id)],
);
