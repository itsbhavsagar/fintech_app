import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export const sendVerificationToken = async (to: string) => {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) {
    console.log("----------------------------------------");
    console.log(`[Twilio Mock] Verification token sent to ${to}`);
    console.log("----------------------------------------");
    return;
  }

  const client = twilio(accountSid, authToken);
  try {
    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to, channel: 'sms' });
    console.log(`[Twilio Verify] Token sent to ${to}`);
  } catch (error) {
    console.error("[Twilio Verify] Failed to send token:", error);
    throw error;
  }
};

export const checkVerificationToken = async (to: string, code: string): Promise<boolean> => {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!accountSid || !authToken || !serviceSid) {
    console.log(`[Twilio Mock] Verified token ${code} for ${to}`);
    // Mock always succeeds if credentials are missing
    return true;
  }

  const client = twilio(accountSid, authToken);
  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to, code });

    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error("[Twilio Verify] Failed to check token:", error);
    return false;
  }
};
