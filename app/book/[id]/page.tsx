import BookingPageClient from './BookingPageClient';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingPageClient lawyerId={id} />;
}
