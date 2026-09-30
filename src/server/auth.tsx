import { APIError } from "better-auth/api";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { renderEmail } from "../emails/_render";
import SignInEmail, { signInSubject } from "../emails/sign-in";
import WelcomeEmail, { welcomeSubject } from "../emails/welcome";
import { createAuth } from "./auth-config";
import * as schema from "./db/schema";
import { sendEmail } from "./email";
import { offerFor, purchaseStatus } from "./polar";

// `env` from `cloudflare:workers` is readable at module scope; the D1 binding
// is only queried inside requests.
export const auth = createAuth(drizzle(env.DB, { schema }), {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  // There are no open sign-ups: a link is only sent to an email that has a
  // paid Polar order, which is how buyers reach their purchase.
  // The welcome flag comes from the client and only picks the template; the
  // purchase check below still gates every send.
  sendMagicLink: async (email, url, { welcome }) => {
    const purchase = await purchaseStatus(email);
    if (!purchase.purchased) {
      throw new APIError("FORBIDDEN", {
        message:
          "We couldn’t find a purchase for this email. Use the email you paid with.",
      });
    }
    if (welcome) {
      const { released } = await offerFor();
      const firstName = purchase.name?.trim().split(/\s+/u)[0] || null;
      const props = { firstName, preorder: purchase.preorder, released, url };
      await sendEmail({
        subject: welcomeSubject(props),
        to: email,
        ...(await renderEmail(<WelcomeEmail {...props} />)),
      });
      return;
    }
    await sendEmail({
      subject: signInSubject,
      to: email,
      ...(await renderEmail(<SignInEmail url={url} />)),
    });
  },
});
