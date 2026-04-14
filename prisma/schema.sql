-- CreateTable
CREATE TABLE "barrels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variant" TEXT,
    "year" TEXT NOT NULL,
    "volume" REAL,
    "status" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "readings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "oechsle" REAL,
    "temperature" REAL,
    "density" REAL,
    "ph" REAL,
    "notes" TEXT,
    "barrel_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "readings_barrel_id_fkey" FOREIGN KEY ("barrel_id") REFERENCES "barrels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "additions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "barrel_id" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "additions_barrel_id_fkey" FOREIGN KEY ("barrel_id") REFERENCES "barrels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "calculation_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" BIGINT NOT NULL,
    "result" TEXT NOT NULL,
    "unit" TEXT,
    "updated_at" DATETIME NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "readings_barrel_id_idx" ON "readings"("barrel_id");

-- CreateIndex
CREATE INDEX "additions_barrel_id_idx" ON "additions"("barrel_id");

