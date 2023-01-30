-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "frontpageName" TEXT NOT NULL,
    "frontpageDomainId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WhitelistedUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subdomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "cfZoneId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SubdomainToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SubdomainToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Subdomain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubdomainToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubdomainToUser_AB_unique" ON "_SubdomainToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SubdomainToUser_B_index" ON "_SubdomainToUser"("B");
