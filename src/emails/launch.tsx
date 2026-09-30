import { SITE } from "../constants/site";
import { SITE_ORIGIN } from "../constants/url";
import { EmailLayout, Paragraph } from "./_layout";

export const launchSubject = `${SITE.NAME} is ready — claim your GitHub access`;

// Sent once per preorder buyer by scripts/polar-launch.ts.
const LaunchEmail = () => (
  <EmailLayout
    action={{
      label: "Sign in and claim access",
      url: `${SITE_ORIGIN}/sign-in`,
    }}
    heading={`${SITE.NAME} is ready`}
    preview="Sign in and link your GitHub account to get the private repository."
    reason={`You received this because you preordered ${SITE.NAME} on`}
  >
    <Paragraph>
      Your {SITE.NAME} preorder is ready, and your preorder price is locked in.
    </Paragraph>
    <Paragraph>
      Sign in with the email you used at checkout. On your dashboard, open the
      Polar customer portal, link your GitHub account, and accept the private
      repository invite.
    </Paragraph>
    <Paragraph>Questions? Just reply to this email.</Paragraph>
  </EmailLayout>
);

export default LaunchEmail;
