import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: "jesusvazquezama760@livefree.website",
    to: [email],
    subject: "Email Verification Code",
    html: `<p>Your code: <strong>${code}</strong></p>`,
  });

  if (error) {
    throw new Error(`Email Failed ${error.message}`);
  }
  return data;
}
