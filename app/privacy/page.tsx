import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ThreadClip',
  description: 'ThreadClip Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
      <article className="max-w-2xl mx-auto prose prose-invert">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">Privacy Policy</h1>
        
        <p className="text-[var(--color-text-secondary)] mb-4">
          Last updated: January 16, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">1. Information We Collect</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            ThreadClip collects the following information:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Google account information (email, name) for authentication</li>
            <li>Threads post URLs that you choose to save</li>
            <li>Tags and notes you add to saved posts</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">2. How We Use Your Information</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            We use the collected information to:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Provide and maintain the ThreadClip service</li>
            <li>Authenticate your account</li>
            <li>Store and display your saved Threads posts</li>
            <li>Enable search functionality across your saved content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">3. Data Storage</h2>
          <p className="text-[var(--color-text-secondary)]">
            Your data is securely stored using Supabase, a trusted cloud database provider. 
            We do not sell, trade, or share your personal information with third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">4. Data Deletion</h2>
          <p className="text-[var(--color-text-secondary)]">
            You can delete your saved posts at any time through the app. 
            To request complete account deletion, please contact us at the email below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">5. Third-Party Services</h2>
          <p className="text-[var(--color-text-secondary)]">
            ThreadClip uses the following third-party services:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Google OAuth for authentication</li>
            <li>Meta/Threads oEmbed API for displaying post previews</li>
            <li>Supabase for data storage</li>
            <li>Vercel for hosting</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">6. Contact</h2>
          <p className="text-[var(--color-text-secondary)]">
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:mynameishur@naver.com" className="text-[var(--color-primary)] hover:underline">
              mynameishur@naver.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
