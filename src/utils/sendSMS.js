export async function sendSms() {
  const twilio = require("twilio");
  try {
    const accountSid = import.meta.env.ACCOUNT_SID;
    const authToken = import.meta.env.ACCOUNT_TOKEN;
    const client = twilio(accountSid, authToken);
    await client.messages
      .create({
        from: "+18454090174",
        to: "+639499194497",
      })
      .then((message) => console.log(message.sid))
      .done();
  } catch (e) {
    console.log(e);
  }
}
