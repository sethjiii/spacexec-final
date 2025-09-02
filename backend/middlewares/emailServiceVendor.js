// services/emailServiceVendor.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVendorApprovalEmail(name, email, businessName) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "✅ Vendor Application Approved",
    text: `Hello ${name},\n\nCongratulations! Your vendor application for "${businessName}" has been approved.\n\nYou can now access your vendor dashboard.`,
  });
}

async function sendVendorRejectionEmail(name, email, businessName, reason) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "❌ Vendor Application Rejected",
    text: `Hello ${name},\n\nUnfortunately, your vendor application for "${businessName}" has been rejected.\nReason: ${reason}.`,
  });
}

async function sendVendorWelcomeEmail(name, email, businessName) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "👋 Welcome to Our Vendor Platform",
    text: `Hello ${name},\n\nWelcome aboard! Your vendor account for "${businessName}" is now active.`,
  });
}

module.exports = {
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
  sendVendorWelcomeEmail,
};
