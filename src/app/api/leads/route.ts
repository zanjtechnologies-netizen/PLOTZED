import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for lead form
const leadSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    budget: z.string().optional(),
    purpose: z.string().optional(),
    message: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = leadSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, phone, budget, purpose, message } = result.data;

        // Format the detailed message
        const detailedMessage = `
Source: Exclusive Landing Page
Budget Range: ${budget || 'Not specified'}
Purpose: ${purpose || 'Not specified'}
Specific Inquiry: ${message || 'None'}
    `.trim();

        // Create inquiry in database
        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                phone,
                message: detailedMessage,
                source: 'LANDING_PAGE',
                status: 'NEW',
            },
        });

        return NextResponse.json(
            { success: true, message: 'Lead captured successfully', id: inquiry.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error capturing lead:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
