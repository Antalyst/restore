-- Add image_path column to items table
ALTER TABLE `items` ADD COLUMN `image_path` varchar(255) DEFAULT NULL AFTER `max_stock_level`; 