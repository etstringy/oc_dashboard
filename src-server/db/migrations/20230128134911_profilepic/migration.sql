/*
  Warnings:

  - Added the required column `pfp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pfp" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "frontpageName" TEXT NOT NULL,
    "frontpageDomainId" TEXT NOT NULL
);
INSERT INTO "new_User" ("admin", "discordId", "frontpageDomainId", "frontpageName", "id", "tag", "username") SELECT "admin", "discordId", "frontpageDomainId", "frontpageName", "id", "tag", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
