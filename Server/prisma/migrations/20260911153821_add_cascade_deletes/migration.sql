-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_guestId_fkey";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
