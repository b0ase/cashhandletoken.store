-- CreateTable
CREATE TABLE "bsv_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "txId" TEXT NOT NULL,
    "inscriptionId" TEXT,
    "transactionType" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT,
    "amount" BIGINT,
    "fee" BIGINT,
    "blockHeight" BIGINT,
    "blockHash" TEXT,
    "confirmations" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "confirmedAt" DATETIME,
    "tokenId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bsv_transactions_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "tokens" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "handcashHandle" TEXT NOT NULL,
    "totalSupply" BIGINT NOT NULL DEFAULT 1000000000,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bsvTxId" TEXT,
    "tokenType" TEXT NOT NULL DEFAULT 'ORDINAL',
    "inscriptionId" TEXT,
    "contentType" TEXT,
    "ordinalsContent" TEXT,
    "ordinalNumber" BIGINT,
    "satoshiNumber" BIGINT,
    "mintingTxId" TEXT,
    "mintingAddress" TEXT,
    "confirmedAt" DATETIME,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "tokens_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tokens" ("bsvTxId", "createdAt", "description", "handcashHandle", "id", "ownerId", "symbol", "tokenType", "totalSupply", "updatedAt") SELECT "bsvTxId", "createdAt", "description", "handcashHandle", "id", "ownerId", "symbol", "tokenType", "totalSupply", "updatedAt" FROM "tokens";
DROP TABLE "tokens";
ALTER TABLE "new_tokens" RENAME TO "tokens";
CREATE UNIQUE INDEX "tokens_symbol_key" ON "tokens"("symbol");
CREATE UNIQUE INDEX "tokens_handcashHandle_key" ON "tokens"("handcashHandle");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "bsv_transactions_txId_key" ON "bsv_transactions"("txId");
