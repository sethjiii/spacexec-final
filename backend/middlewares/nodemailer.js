const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require("jsonwebtoken");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
});

const sendSpaceXecJoiningEmail = (name, email) => {
    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to SpaceXec</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    color: #007BFF;
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 20px;
                }
                .info-box {
                    background-color: #f0f8ff;
                    border: 1px solid #007BFF;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .info-box h2 {
                    color: #007BFF;
                    margin-top: 0;
                }
                ul {
                    padding-left: 20px;
                }
                li {
                    margin-bottom: 10px;
                }
                strong {
                    color: #007BFF;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 14px;
                    color: #666;
                }
                a {
                    color: #007BFF;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to SpaceXec 🚀</h1>

            <div class="info-box">
                <h2>Dear ${name},</h2>
                <p>Welcome to <strong>SpaceXec</strong> — the first-of-its-kind <strong>fragmented ownership community</strong> within the AeroModelling Club!</p>
                <p>As a contributor, you'll receive unique <strong>NFT tokens</strong> representing your contributions, responsibilities, and governance rights. Think of them as proof-of-work and access keys, similar to tokens in platforms like <strong>ENV</strong>.</p>
                <p>Your journey with SpaceXec will unlock:</p>
                <ul>
                    <li><strong>Earned NFTs:</strong> Representing your project involvement, skillsets, and achievements.</li>
                    <li><strong>Governance Rights:</strong> Vote on key decisions and proposals within the club.</li>
                    <li><strong>Access Privileges:</strong> Special invites, behind-the-scenes strategy meetings, and more.</li>
                    <li><strong>Cross-functional Roles:</strong> Content creation, outreach, event strategy, and technical integrations.</li>
                </ul>
                <p>This is more than a team — it's a decentralized contribution ecosystem where your efforts are permanently recognized and rewarded.</p>
                <p><a href="https://chat.whatsapp.com/YOUR_SPACEXEC_GROUP_LINK">👉 Join the SpaceXec WhatsApp Group</a> to get started.</p>
            </div>

            <div class="footer">
                <p>Welcome aboard, ${name}. Let’s build the future — one token at a time.</p>
                <p>— The SpaceXec Core Team</p>
                <p><a href="#">Website</a> | <a href="#">Instagram</a></p>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `${process.env.USER_EMAIL}`,
        to: email,
        subject: '🚀 Welcome to SpaceXec — Your Tokenized Contribution Journey Begins!',
        html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending SpaceXec email:', error);
        } else {
            console.log('SpaceXec tokenized welcome email sent:', info.response);
        }
    });
};

/**
 * Sends a verification email containing a JWT token link for user registration confirmation.
 * @param {Object} userData - Object containing user data: { name, email, password, role }
 */
const sendVerificationEmail = async (userData) => {
    // Create encrypted JWT token with all user details
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "1d", // token expires in 1 day
    });

    const verificationUrl = `${process.env.BACKEND_URL}/api/users/verify-registration/${token}`;


    const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              h1 {
                  color: #007BFF;
                  text-align: center;
                  font-size: 28px;
                  margin-bottom: 20px;
              }
              .content-box {
                  background-color: #f9f9f9;
                  border: 1px solid #007BFF;
                  border-radius: 5px;
                  padding: 20px;
                  margin-bottom: 20px;
                  text-align: center;
              }
              a {
                  background-color: #007BFF;
                  color: white !important;
                  padding: 12px 20px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                  display: inline-block;
                  margin-top: 20px;
              }
              a:hover {
                  background-color: #0056b3;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #ddd;
                  font-size: 14px;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <h1>Email Verification</h1>
          <div class="content-box">
              <p>Hi <strong>${userData.name}</strong>,</p>
              <p>Thank you for registering on our platform. Please verify your email address by clicking the button below.</p>
              <a href="${verificationUrl}">Verify My Email</a>
              <p>If you did not sign up, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>— The SpaceXec Core Team</p>
          </div>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: userData.email,
      subject: "🔐 Verify your email for SpaceXec registration",
      html: message,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Verification email sent:", info.response);
    } catch (error) {
      console.error("❌ Error sending verification email:", error);
    }
  };
  

  const sendForgotPasswordEmailWithExpiry = (name, email, resetLink, expiryHours = 1) => {
    console.log(process.env.USER_EMAIL)
    console.log(process.env.USER_PASS)
    const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #D4AF37;
            text-align: center;
            font-size: 28px;
            margin-bottom: 20px;
          }
          .info-box {
            background-color: #f0f8ff;
            border: 1px solid #D4AF37;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
          }
          a {
            color: #D4AF37;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Password Reset Request</h1>
        <div class="info-box">
          <p>Hello ${name},</p>
          <p>To reset your password for your SpaceXec account, please click the link below. This link will expire in ${expiryHours} hour(s).</p>
          <p><a href="${resetLink}">Reset Your Password</a></p>
          <p>If you did not request a password reset, please ignore this email or contact support.</p>
        </div>
        <div class="footer">
          <p>Thanks,</p>
          <p>The SpaceXec Core Team</p>
          <p><a href="mailto:support@spacexec.com">support@spacexec.com</a></p>
        </div>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "🔐 SpaceXec Password Reset Link - Time Sensitive",
      html: message,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending forgot password email:", error);
      } else {
        console.log("Forgot password email sent:", info.response);
      }
    });
  };
  
  

module.exports={sendSpaceXecJoiningEmail,sendVerificationEmail,sendForgotPasswordEmailWithExpiry};
