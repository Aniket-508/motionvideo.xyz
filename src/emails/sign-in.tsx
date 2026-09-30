import { SITE } from "../constants/site";
import { EmailLayout, Paragraph } from "./_layout";

export const signInSubject = `Sign in to ${SITE.NAME}`;

const SignInEmail = ({ url }: { url: string }) => (
  <EmailLayout
    action={{ label: `Sign in to ${SITE.NAME}`, url }}
    heading={signInSubject}
    preview="Your sign-in link expires in 15 minutes."
    reason="You received this because this address was used to sign in on"
  >
    <Paragraph>
      Use the button below to sign in. The link expires in 15 minutes.
    </Paragraph>
    <Paragraph>
      If you didn’t ask to sign in, you can ignore this email.
    </Paragraph>
  </EmailLayout>
);

SignInEmail.PreviewProps = {
  url: "https://motionvideo.xyz/api/auth/magic-link/verify?token=preview",
};

export default SignInEmail;
