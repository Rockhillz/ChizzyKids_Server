
const WELCOME_EMAIL_TEMPLATE = (fullname) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Chizzy Kids Group of Schools</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #1e3a8a, #120934); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://res.cloudinary.com/djbtdlzrj/image/upload/v1746911629/ChizzyKids_logo_hcgxui.png" alt="ChizzyKids Logo" style="width: 120px; margin-bottom: 20px; border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">Welcome to Chizzy Kids!</h1>
    <p style="color: #d1d5db; margin-top: 10px; font-size: 16px;">A community where teachers and students grow together.</p>
  </div>

  <!-- Body Section -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 18px; color: #1e3a8a;"><strong>Hello ${fullname},</strong></p>
    <p>We are delighted to welcome you to the <strong>Chizzy Kids Group of Schools</strong>. Whether you are joining us as a teacher or a student, you are now part of a vibrant family that values <em>excellence, creativity, and diversity</em>.</p>
    
    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #1e3a8a;">
      <p style="font-size: 16px; margin: 0;"><strong>Together, here’s what we look forward to:</strong></p>
      <ul style="padding-left: 20px; margin: 10px 0; color: #333;">
        <li>Building a collaborative and supportive learning environment.</li>
        <li>Exploring new ideas, talents, and academic opportunities.</li>
        <li>Celebrating cultural diversity and school community values.</li>
        <li>Striving for personal growth, academic excellence, and leadership.</li>
      </ul>
    </div>

    <p style="font-size: 16px;">If you have any questions or need support, feel free to reach us at <a href="charitydara0@gmail.com" style="color: #2563eb; text-decoration: none;">charitydara0@gmail.com</a>. or call us at <a href="tel:+2348060540369" style="color: #2563eb; text-decoration: none;">+234 806 054 0369</a>.</p>
    <p style="font-size: 16px; color: #120934; font-weight: bold;">We’re excited to have you on this journey with us!<br>The Chizzy Kids Team</p>
  </div>

  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.85em;">
    <p>© ${new Date().getFullYear()} Chizzy Kids Group of Schools. All rights reserved.</p>
    <p><a href="#" style="color: #1e3a8a; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #1e3a8a; text-decoration: none;">Terms of Service</a></p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = (fullname) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <!-- Header -->
  <div style="background: linear-gradient(to right, #1e3a8a, #120934); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://res.cloudinary.com/djbtdlzrj/image/upload/v1746911629/ChizzyKids_logo_hcgxui.png" alt="ChizzyKids Logo" style="width: 120px; margin-bottom: 20px; border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">Password Reset Successful</h1>
  </div>

  <!-- Body -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 18px; color: #1e3a8a;">Hello ${fullname},</p>
    <p>Your password has been successfully reset for your <strong>Chizzy Kids Group of Schools</strong> account. If you did not request this change, please contact our school IT support immediately.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #22c55e; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>

    <p>Thank you for keeping your account secure.</p>
    <p style="font-size: 16px; color: #120934; font-weight: bold;">Best regards,<br>The Chizzy Kids Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.85em;">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>© ${new Date().getFullYear()} Chizzy Kids Group of Schools. All rights reserved.</p>
  </div>
</body>
</html>
`;


const PASSWORD_RESET_REQUEST_TEMPLATE = (fullname, resetToken) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <!-- Header -->
  <div style="background: linear-gradient(to right, #1e3a8a, #120934); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://res.cloudinary.com/djbtdlzrj/image/upload/v1746911629/ChizzyKids_logo_hcgxui.png" alt="ChizzyKids Logo" style="width: 120px; margin-bottom: 20px; border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">Password Reset Request</h1>
  </div>

  <!-- Body -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 18px; color: #1e3a8a;">Hello ${fullname},</p>
    <p>We received a request to reset the password for your <strong>Chizzy Kids Group of Schools</strong> account. If you did not make this request, you can safely ignore this email.</p>
    <p>To reset your password, please use the following verification code:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background-color: #1e3a8a; color: white; padding: 15px 25px; font-size: 28px; font-weight: bold; border-radius: 8px; letter-spacing: 5px;">${resetToken}</div>
    </div>

    <p>This reset code will expire in <strong>15 minutes</strong> for security purposes.</p>
    
    <p style="font-size: 16px; margin: 20px 0;"><strong>For your security, we recommend the following:</strong></p>
    <ul style="padding-left: 20px; color: #333;">
      <li>Use a strong, unique password</li>
      <li>Do not share your login details with anyone</li>
      <li>Update your password regularly</li>
    </ul>

    <p style="font-size: 16px; color: #120934; font-weight: bold;">Best regards,<br>The Chizzy Kids Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.85em;">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>© ${new Date().getFullYear()} Chizzy Kids Group of Schools. All rights reserved.</p>
  </div>
</body>
</html>
`;

const NEW_ENQUIRY_TEMPLATE = (fullName, phone, subject, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <!-- Header -->
  <div style="background: linear-gradient(to right, #1e3a8a, #120934); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://res.cloudinary.com/djbtdlzrj/image/upload/v1746911629/ChizzyKids_logo_hcgxui.png" alt="ChizzyKids Logo" style="width: 120px; margin-bottom: 20px; border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">📩 New Enquiry Received</h1>
  </div>

  <!-- Body -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 18px; color: #1e3a8a;">Hello Admin,</p>
    <p>You’ve received a new enquiry from a parent via the <strong>Chizzy Kids Group of Schools</strong> website.</p>
    
    <div style="margin: 20px 0; padding: 20px; background-color: #f3f4f6; border-left: 5px solid #1e3a8a; border-radius: 8px;">
      <p><strong>👤 FullName:</strong> ${fullName}</p>
      <p><strong>📞 Phone:</strong> ${phone}</p>
      <p><strong>📝 Subject:</strong> ${subject}</p>
    </div>

    <p><strong>Message:</strong></p>
    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa; white-space: pre-line;">
      ${message}
    </div>

    <p style="font-size: 16px; color: #120934; font-weight: bold; margin-top: 30px;">
      Best regards,<br>
      The Chizzy Kids Website
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.85em;">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>© ${new Date().getFullYear()} Chizzy Kids Group of Schools. All rights reserved.</p>
  </div>
</body>
</html>
`;


module.exports = {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    NEW_ENQUIRY_TEMPLATE
}