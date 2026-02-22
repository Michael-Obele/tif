import { error } from '@sveltejs/kit';
import { command, form, query } from '$app/server';
import { email, minLength, string, object, pipe } from 'valibot';
import prisma from '$lib/db/prisma';

// Validation schema for waitlist email
const WaitlistSchema = object({
	email: pipe(string(), minLength(1, 'Email is required'), email('Invalid email address'))
});

/**
 * Get all waitlist subscribers (admin only)
 * @returns Array of waitlist entries
 */
export const getWaitlistSubscribers = query(async () => {
	try {
		const subscribers = await prisma.waitlist.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});

		return {
			success: true,
			data: subscribers
		};
	} catch (err) {
		console.error('Error fetching waitlist:', err);
		throw error(500, 'Failed to fetch waitlist');
	}
});

/**
 * Subscribe email to waitlist
 * @param email - The email address to subscribe
 * @returns Success status or error message
 */
export const subscribeToWaitlist = form(
	WaitlistSchema,
	async ({ email }): Promise<{ success: boolean; message: string }> => {
		try {
			// Check if email already exists
			const existing = await prisma.waitlist.findUnique({
				where: { email }
			});

			if (existing) {
				return {
					success: false,
					message: 'This email is already on the waitlist'
				};
			}

			// Add to waitlist
			await prisma.waitlist.create({
				data: {
					email
				}
			});

			return {
				success: true,
				message: 'Successfully added to waitlist!'
			};
		} catch (err) {
			console.error('Waitlist subscription error:', err);
			return {
				success: false,
				message: 'Failed to subscribe to waitlist. Please try again.'
			};
		}
	}
);

/**
 * Remove email from waitlist
 * @param email - The email to remove
 * @returns Success status
 */
export const removeFromWaitlist = command(
	pipe(string(), email()),
	async (email): Promise<{ success: boolean; message: string }> => {
		try {
			await prisma.waitlist.delete({
				where: { email }
			});

			return {
				success: true,
				message: 'Removed from waitlist'
			};
		} catch (err) {
			console.error('Error removing from waitlist:', err);
			return {
				success: false,
				message: 'Failed to remove from waitlist'
			};
		}
	}
);
