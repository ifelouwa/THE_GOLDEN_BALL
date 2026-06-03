import { Resend } from "resend";

// Resend requires an API key in the environment variables
// process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

// Use Resend's testing domain for development
const FROM_EMAIL = "The Golden Ball <onboarding@resend.dev>";

export const sendWelcomeEmail = async (email, username) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Welcome email not sent.");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email, // Free Resend accounts can only send to the email address you registered with!
      subject: "Welcome to The Golden Ball Auctions!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #D4AF37;">Welcome, ${username}!</h2>
          <p>Thank you for registering at <strong>The Golden Ball</strong>. You are now ready to place bids on our exclusive, premium items.</p>
          <p>Check out our live auctions and happy bidding!</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">The Golden Ball Auction House</p>
        </div>
      `,
    });
    if (error) console.error("Resend Error:", error);
    return data;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

export const sendWinnerEmail = async (email, username, productTitle, winAmount) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Winner email not sent.");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You Won the Auction! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #D4AF37;">Congratulations, ${username}! 🎉</h2>
          <p>You are the winning bidder for <strong>${productTitle}</strong>!</p>
          <p>Your winning bid was <strong style="color: #10B981;">$${winAmount.toFixed(2)}</strong>.</p>
          <p>Please log in to your account to view the details and arrange for payment.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">The Golden Ball Auction House</p>
        </div>
      `,
    });
    if (error) console.error("Resend Error:", error);
    return data;
  } catch (error) {
    console.error("Failed to send winner email:", error);
  }
};
