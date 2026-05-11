-- CreateEnum
CREATE TYPE "SensorType" AS ENUM (
  'RAIN',
  'RIVER_LEVEL',
  'SOIL_MOISTURE',
  'WEATHER',
  'TEMPERATURE',
  'HUMIDITY'
);

-- CreateEnum
CREATE TYPE "SensorStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'MAINTENANCE',
  'OFFLINE'
);

-- CreateTable
CREATE TABLE "Sensor" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" "SensorType" NOT NULL,
  "organizationId" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "status" "SensorStatus" NOT NULL,
  "batteryLevel" INTEGER,
  "lastCommunicationAt" TIMESTAMP(3),
  "geom" geometry(Point, 4326),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sensor_organizationId_idx" ON "Sensor"("organizationId");

-- CreateIndex
CREATE INDEX "Sensor_type_idx" ON "Sensor"("type");

-- CreateIndex
CREATE INDEX "Sensor_status_idx" ON "Sensor"("status");

