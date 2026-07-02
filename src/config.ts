// ---------------------------------------------------------------------------
// Feedback inbox configuration.
//
// The app is a static site (no backend), so feedback is delivered to YOU via a
// free form service. Pick ONE of the two options below — only you can read the
// results, and visitors never need their own account or email app.
//
// OPTION A (recommended) — Formspree: gives you a private dashboard + email.
//   1. Go to https://formspree.io and sign up (free).
//   2. Create a new form; copy its endpoint, e.g. https://formspree.io/f/abcdwxyz
//   3. Paste it into FORMSPREE_ENDPOINT below.
//
// OPTION B — just your email (via Formsubmit, no signup):
//   1. Put your email in OWNER_EMAIL below.
//   2. The FIRST time someone submits, you get a one-time confirmation email —
//      click the link to activate. After that, feedback lands in your inbox.
//   (Tip: after activating you can replace OWNER_EMAIL with the random alias
//    Formsubmit gives you so your address isn't visible in the page source.)
//
// If BOTH are left blank, the form still shows but explains it isn't connected
// yet. FORMSPREE_ENDPOINT takes priority when both are set.
// ---------------------------------------------------------------------------

export const FORMSPREE_ENDPOINT = ''
export const OWNER_EMAIL = ''

export function feedbackEndpoint(): string | null {
  if (FORMSPREE_ENDPOINT.trim()) return FORMSPREE_ENDPOINT.trim()
  if (OWNER_EMAIL.trim()) return `https://formsubmit.co/ajax/${OWNER_EMAIL.trim()}`
  return null
}
