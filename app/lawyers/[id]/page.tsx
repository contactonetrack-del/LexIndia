import LawyerProfileClient from './LawyerProfileClient';

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LawyerProfileClient id={id} />;
}
