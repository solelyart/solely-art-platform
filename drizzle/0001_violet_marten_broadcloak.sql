CREATE TABLE `artistProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`bio` text,
	`location` varchar(255),
	`categories` text NOT NULL,
	`portfolioImages` text,
	`hourlyRate` int,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artistProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `artistProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `artistSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`bookingBufferMinutes` int NOT NULL DEFAULT 0,
	`advanceBookingDays` int NOT NULL DEFAULT 30,
	`cancellationPolicy` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artistSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `artistSettings_artistId_unique` UNIQUE(`artistId`)
);
--> statement-breakpoint
CREATE TABLE `availabilityWindows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`timezone` varchar(64) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availabilityWindows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blackoutDates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`reason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blackoutDates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`artistId` int NOT NULL,
	`serviceDescription` text NOT NULL,
	`requestedDate` timestamp NOT NULL,
	`status` enum('pending','accepted','declined','completed','cancelled') NOT NULL DEFAULT 'pending',
	`budget` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`clientId` int NOT NULL,
	`artistId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_bookingId_unique` UNIQUE(`bookingId`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`durationMinutes` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slotLocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`durationMinutes` int NOT NULL,
	`lockedBy` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slotLocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('client','artist','both') DEFAULT 'client' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhotoUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhotoKey` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `artist_profiles_user_id_idx` ON `artistProfiles` (`userId`);--> statement-breakpoint
CREATE INDEX `artist_settings_artist_id_idx` ON `artistSettings` (`artistId`);--> statement-breakpoint
CREATE INDEX `availability_windows_artist_id_idx` ON `availabilityWindows` (`artistId`);--> statement-breakpoint
CREATE INDEX `availability_windows_day_of_week_idx` ON `availabilityWindows` (`dayOfWeek`);--> statement-breakpoint
CREATE INDEX `blackout_dates_artist_id_idx` ON `blackoutDates` (`artistId`);--> statement-breakpoint
CREATE INDEX `bookings_client_id_idx` ON `bookings` (`clientId`);--> statement-breakpoint
CREATE INDEX `bookings_artist_id_idx` ON `bookings` (`artistId`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `bookings_created_at_idx` ON `bookings` (`createdAt`);--> statement-breakpoint
CREATE INDEX `reviews_artist_id_idx` ON `reviews` (`artistId`);--> statement-breakpoint
CREATE INDEX `reviews_booking_id_idx` ON `reviews` (`bookingId`);--> statement-breakpoint
CREATE INDEX `services_artist_id_idx` ON `services` (`artistId`);--> statement-breakpoint
CREATE INDEX `services_is_active_idx` ON `services` (`isActive`);--> statement-breakpoint
CREATE INDEX `slot_locks_artist_id_idx` ON `slotLocks` (`artistId`);--> statement-breakpoint
CREATE INDEX `slot_locks_date_idx` ON `slotLocks` (`date`);--> statement-breakpoint
CREATE INDEX `slot_locks_expires_at_idx` ON `slotLocks` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `slot_locks_locked_by_idx` ON `slotLocks` (`lockedBy`);