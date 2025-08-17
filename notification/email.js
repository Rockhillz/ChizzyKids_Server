const transporter = require("./emailConfig");
const { NEW_ENQUIRY_TEMPLATE } = require("./emailTemplates");
const {
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,

} = require("./emailTemplates");


const sendWelcomeEmail = async (email, fullname) => {
  try {
    await transporter.sendMail({
      from: `"Chizzy Kids" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Chizzy Kids Group of Schools",
      html: WELCOME_EMAIL_TEMPLATE(fullname),
    });
  } catch (error) {
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, fullname, resetToken) => {
  try {
    await transporter.sendMail({
      from: `"Chizzy Kids" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE(fullname, resetToken),
    });
  } catch (error) {
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email, fullname) => {
  try {
    await transporter.sendMail({
      from: `"Chizzy Kids" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(fullname),
    });
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

const sendEnquiryEmail = async ( fullName, phone, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Chizzy Kids" <${process.env.SMTP_USER}>`,
      to: "alasizuchukwu@gmail.com",
      subject: "New Enquiry Submission",
      html: NEW_ENQUIRY_TEMPLATE(fullName, phone, subject, message),
    });
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendEnquiryEmail
 
};
