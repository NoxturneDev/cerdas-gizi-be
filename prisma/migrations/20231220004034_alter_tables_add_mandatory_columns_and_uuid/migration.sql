/*
  Warnings:

  - A unique constraint covering the columns `[childrenId]` on the table `Children` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `Parents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `childrenId` to the `Children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Parents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `children` ADD COLUMN `childrenId` CHAR(36) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `parents` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `parentId` CHAR(36) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` CHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Children_childrenId_key` ON `Children`(`childrenId`);

-- CreateIndex
CREATE UNIQUE INDEX `Parents_parentId_key` ON `Parents`(`parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_userId_key` ON `Users`(`userId`);
