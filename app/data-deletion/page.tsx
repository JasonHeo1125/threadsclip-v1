import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion - ThreadClip',
  description: 'How to delete your data from ThreadClip',
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-12 px-4">
      <article className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">Data Deletion Instructions</h1>
        
        <p className="text-[var(--color-text-secondary)] mb-6">
          ThreadClip respects your privacy and provides multiple ways to delete your data.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Delete Individual Posts</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            You can delete any saved Threads post directly from the app:
          </p>
          <ol className="list-decimal list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Log in to your ThreadClip account</li>
            <li>Find the post you want to delete</li>
            <li>Click the trash icon on the post card</li>
            <li>The post will be permanently deleted</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Delete All Data / Account</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            To request complete deletion of your account and all associated data:
          </p>
          <ol className="list-decimal list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Send an email to <a href="mailto:mynameishur@naver.com" className="text-[var(--color-primary)] hover:underline">mynameishur@naver.com</a></li>
            <li>Include &quot;Data Deletion Request&quot; in the subject line</li>
            <li>Provide the email address associated with your account</li>
            <li>We will process your request within 30 days</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">What Data Will Be Deleted</h2>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>Your account information</li>
            <li>All saved Threads posts</li>
            <li>All tags and notes</li>
            <li>Authentication tokens</li>
          </ul>
        </section>

        <p className="text-[var(--color-text-muted)] text-sm">
          Note: Deletion is permanent and cannot be undone.
        </p>
      </article>
    </main>
  );
}
