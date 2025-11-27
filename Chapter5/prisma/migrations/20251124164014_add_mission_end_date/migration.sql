/*
  Warnings:

  - You are about to alter the column `created_at` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `started_at` on the `mission_attempt` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `request_at` on the `mission_attempt` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `approved_at` on the `mission_attempt` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `completed_at` on the `mission_attempt` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `point_history` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `region_reward` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `review` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `created_at` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `birth` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `inactive_date` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `selected_at` on the `user_preferred_category` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `visited_at` on the `visit` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `mission` ADD COLUMN `end_date` DATETIME NULL,
    MODIFY `created_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `mission_attempt` MODIFY `started_at` TIMESTAMP NULL,
    MODIFY `request_at` DATETIME NULL,
    MODIFY `approved_at` DATETIME NULL,
    MODIFY `completed_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `point_history` MODIFY `created_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `region_reward` MODIFY `created_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `review` MODIFY `created_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `store` MODIFY `created_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `birth` DATETIME NOT NULL,
    MODIFY `inactive_date` DATETIME NULL,
    MODIFY `created_at` TIMESTAMP NULL,
    MODIFY `updated_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `user_preferred_category` MODIFY `selected_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `visit` MODIFY `visited_at` TIMESTAMP NULL;
