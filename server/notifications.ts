import { notifyOwner } from "./_core/notification";

/**
 * Notification triggers for booking lifecycle events
 * These send email notifications to the platform owner
 * Future enhancement: Send directly to artists/clients
 */

export async function notifyBookingCreated(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
  requestedDate: Date;
  budget: number | null;
}) {
  const dateStr = params.requestedDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return await notifyOwner({
    title: "New Booking Request",
    content: `${params.clientName} has requested a booking with ${params.artistName}.\n\nService: ${params.serviceDescription}\nDate: ${dateStr}\nBudget: ${params.budget ? `$${params.budget}` : 'Not specified'}`,
  });
}

export async function notifyBookingAccepted(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
  requestedDate: Date;
}) {
  const dateStr = params.requestedDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return await notifyOwner({
    title: "Booking Accepted",
    content: `${params.artistName} has accepted a booking from ${params.clientName}.\n\nService: ${params.serviceDescription}\nDate: ${dateStr}`,
  });
}

export async function notifyBookingDeclined(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
}) {
  return await notifyOwner({
    title: "Booking Declined",
    content: `${params.artistName} has declined a booking request from ${params.clientName}.\n\nService: ${params.serviceDescription}`,
  });
}

export async function notifyBookingCancelled(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
  cancelledBy: "artist" | "client";
}) {
  return await notifyOwner({
    title: "Booking Cancelled",
    content: `A booking between ${params.artistName} and ${params.clientName} has been cancelled by the ${params.cancelledBy}.\n\nService: ${params.serviceDescription}`,
  });
}

export async function notifyBookingCompleted(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
}) {
  return await notifyOwner({
    title: "Booking Completed",
    content: `${params.artistName} has marked a booking with ${params.clientName} as completed.\n\nService: ${params.serviceDescription}`,
  });
}

export async function notifyBookingReminder(params: {
  artistName: string;
  clientName: string;
  serviceDescription: string;
  requestedDate: Date;
  hoursUntil: number;
}) {
  const dateStr = params.requestedDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return await notifyOwner({
    title: `Booking Reminder (${params.hoursUntil}h)`,
    content: `Upcoming booking in ${params.hoursUntil} hours:\n\nArtist: ${params.artistName}\nClient: ${params.clientName}\nService: ${params.serviceDescription}\nDate: ${dateStr}`,
  });
}


export async function notifyNewMessage(params: {
  senderName: string;
  recipientName: string;
  messagePreview: string;
}) {
  return await notifyOwner({
    title: "New Message",
    content: `${params.senderName} sent a message to ${params.recipientName}.\n\nPreview: "${params.messagePreview}"`,
  });
}
