CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`clientId` int NOT NULL,
	`artistId` int NOT NULL,
	`amount` int NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeCustomerId` varchar(255),
	`status` enum('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentType` enum('deposit','milestone','final') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `payments_booking_idx` ON `payments` (`bookingId`);--> statement-breakpoint
CREATE INDEX `payments_client_idx` ON `payments` (`clientId`);--> statement-breakpoint
CREATE INDEX `payments_artist_idx` ON `payments` (`artistId`);--> statement-breakpoint
CREATE INDEX `payments_stripe_payment_intent_idx` ON `payments` (`stripePaymentIntentId`);