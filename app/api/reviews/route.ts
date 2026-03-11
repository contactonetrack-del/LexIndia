import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, rating, comment } = body;

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Verify appointment exists and belongs to user
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        lawyer: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.citizenId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized attempt to review' }, { status: 403 });
    }

    if (appointment.status !== 'COMPLETED') {
        return NextResponse.json({ error: 'Cannot review an incomplete appointment' }, { status: 400 });
    }

    // Ensure they haven't reviewed this already
    const existingReview = await prisma.review.findUnique({
       where: { appointmentId }
    });

    if (existingReview) {
       return NextResponse.json({ error: 'Review already exists for this appointment' }, { status: 400 });
    }

    // Run review creation and aggregate recalculation in a transaction wrapper
    const [review, updatedLawyer] = await prisma.$transaction(async (tx) => {
        // Create the Review
        const newReview = await tx.review.create({
            data: {
                appointmentId,
                rating,
                comment,
                citizenId: session.user.id,
                lawyerId: appointment.lawyerId,
            }
        });

        // Current totals from Lawyer
        const currentLawyer = appointment.lawyer;
        
        // Calculate new rating mathematically:
        // NewAverage = ((OldAverage * OldCount) + NewRating) / (OldCount + 1)
        const newCount = currentLawyer.reviewCount + 1;
        const totalOldRating = currentLawyer.rating * currentLawyer.reviewCount;
        const newRating = (totalOldRating + rating) / newCount;

        // Apply back to LawyerProfile
        const lawyerUpdate = await tx.lawyerProfile.update({
             where: { id: currentLawyer.id },
             data: {
                 rating: newRating,
                 reviewCount: newCount
             }
        });

        return [newReview, lawyerUpdate];
    });

    return NextResponse.json({ success: true, review, lawyer: updatedLawyer });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
