import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
export async function sendEmail(email: string, token: string) {
  const msg = {
    to: email, // Change to your recipient
    from: "helpjiggler@gmail.com", // Change to your verified sender
    subject: "Voila! You got password token",
    text: "This one time password token to get long time token",
    html: `<strong>Your token is ${token} </strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
