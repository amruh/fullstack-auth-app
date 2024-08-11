import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const domain = `${process.env.FRONTEND_DOMAIN}`;

export const sendVerificationLinkEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/email-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@atigabungajaya.com",
    to: email,
    subject: "Confirm your email",
    html: `
            <h1>Confirm your email</h1>
            <p>Click the link below to confirm your email address.</p>
            <a href="${confirmLink}">Confirm email</a>
        `,
  });
};

export const sendPasswordResetLinkEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/password-reset/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@atigabungajaya.com",
    to: email,
    subject: "Reset your password",
    html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password.</p>
            <a href="${resetLink}">Reset password</a>
        `,
  });
};
