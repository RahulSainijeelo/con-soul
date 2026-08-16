// Force dynamic rendering to prevent prerendering failures when Clerk env vars are missing
export const dynamic = 'force-dynamic';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
