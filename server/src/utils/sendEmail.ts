import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  //  to create new test account
  //let testAccount = await nodemailer.createTestAccount();
  //console.log("test account: ", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "vof6hnzbzms7uv3r@ethereal.email", // generated ethereal user
      pass: "dddbGmSHHcXw8gWgB5", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Change Password",
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
