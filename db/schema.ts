import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const records = pgTable("distance-records", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  distance: doublePrecision().notNull(),
  percentage: doublePrecision().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().$onUpdate(() => new Date()),
});
