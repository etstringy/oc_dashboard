-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pfp" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "frontpageName" TEXT NOT NULL DEFAULT '',
    "frontpageDomainId" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_User" ("admin", "discordId", "frontpageDomainId", "frontpageName", "id", "pfp", "tag", "username") SELECT "admin", "discordId", "frontpageDomainId", "frontpageName", "id", "pfp", "tag", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
