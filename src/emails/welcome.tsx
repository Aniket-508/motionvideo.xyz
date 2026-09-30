import { SITE } from "../constants/site";
import { EmailLayout, Paragraph } from "./_layout";

export interface WelcomeEmailProps {
  url: string;
  /** From the Polar order; null when the buyer left it blank. */
  firstName: string | null;
  preorder: boolean;
  /** Whether the pack has shipped (GitHub benefit attached). */
  released: boolean;
}

export const welcomeSubject = ({
  firstName,
  preorder,
}: Pick<WelcomeEmailProps, "firstName" | "preorder">) =>
  `${firstName ? `${firstName}, thanks` : "Thanks"} for ${preorder ? "preordering" : "buying"} ${SITE.NAME}`;

// Sent instead of the plain sign-in email when the link is requested from
// /welcome, right after checkout.
const WelcomeEmail = ({
  url,
  firstName,
  preorder,
  released,
}: WelcomeEmailProps) => {
  const waiting = preorder && !released;
  return (
    <EmailLayout
      action={{ label: "Open your dashboard", url }}
      heading={`${firstName ? `Welcome aboard, ${firstName}` : "Welcome aboard"}!`}
      preview={
        waiting
          ? "Your preorder is confirmed. Here’s your sign-in link."
          : "Your purchase is confirmed. Here’s your sign-in link."
      }
      reason={`You received this because you ${preorder ? "preordered" : "bought"} ${SITE.NAME} on`}
    >
      <Paragraph>
        {waiting
          ? `Thanks for preordering ${SITE.NAME}. Your order is confirmed and your preorder price is locked in.`
          : `Thanks for buying ${SITE.NAME}. Your order is confirmed.`}
      </Paragraph>
      <Paragraph>
        {waiting
          ? "The skill pack ships on Friday, October 2, 2026, as a private GitHub repository. I’ll email you on launch day with how to claim it."
          : "Sign in, open the Polar customer portal from your dashboard, link your GitHub account, and accept the private repository invite."}
      </Paragraph>
      <Paragraph>
        The button below signs you in and expires in 15 minutes. Questions or
        ideas? Just reply, it comes straight to me.
      </Paragraph>
      <Paragraph>— Aniket</Paragraph>
    </EmailLayout>
  );
};

WelcomeEmail.PreviewProps = {
  firstName: "Aniket",
  preorder: true,
  released: false,
  url: "https://motionvideo.xyz/api/auth/magic-link/verify?token=preview",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
