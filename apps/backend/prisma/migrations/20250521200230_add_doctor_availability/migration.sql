/*
  Warnings:

  - A unique constraint covering the columns `[meetingId,dayOfWeek]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Availability_meetingId_dayOfWeek_key" ON "Availability"("meetingId", "dayOfWeek");
