import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy - SpaceXec</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">Effective Date</h2>
        <p>September, 2025</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Personal Information:</strong> Name, email address, phone number, address, government ID (e.g., PAN, Aadhar), profile photo.</li>
          <li><strong>Payment Information:</strong> Collected and processed through third-party services such as Stripe, Razorpay, or PayPal.</li>
          <li><strong>Authentication Data:</strong> When you log in using Google, OTP, or other methods.</li>
          <li><strong>Technical Information:</strong> IP address, browser type, device type, operating system, and usage data through cookies and Google Analytics.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">2. How We Collect Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Register or create an account</li>
          <li>Fill out forms or submit inquiries</li>
          <li>Make transactions</li>
          <li>Authenticate via third-party services</li>
          <li>Interact with emails or marketing communications</li>
          <li>Browse the site (through cookies and tracking tools)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and improve our platform and services</li>
          <li>Facilitate property co-ownership and transactions</li>
          <li>Respond to support queries</li>
          <li>Send newsletters and marketing emails (you can opt out)</li>
          <li>Analyze website traffic and usage</li>
          <li>Prevent fraud and ensure platform security</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">4. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Recognize returning users</li>
          <li>Measure site performance and traffic</li>
          <li>Enhance user experience</li>
        </ul>
        <p className="mt-2">You can control cookie settings through your browser. In the future, we may also use advertising tools like Google Ads or Facebook Pixel for remarketing.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">5. Sharing Your Information</h2>
        <p>We do not sell your personal information. However, we may share it with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Third-party service providers (e.g., Google Analytics, payment gateways, email tools, CRM systems)</li>
          <li>Legal authorities if required to comply with laws or to protect our rights</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">6. Data Security</h2>
        <p>We implement security measures to protect your data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>SSL encryption</li>
          <li>Secure data storage</li>
          <li>Access control and monitoring</li>
        </ul>
        <p className="mt-2">However, no system is 100% secure, and we cannot guarantee absolute protection.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">7. Age Restrictions</h2>
        <p>SpaceXec is intended only for users aged 18 and above. We do not knowingly collect data from individuals under 18. If we discover such data has been collected, we will delete it promptly.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access, correct, or delete your personal information</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Request a copy of your data</li>
        </ul>
        <p className="mt-2">To make any requests, contact us at <strong>help@spacexec.com</strong>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">9. Third-Party Links</h2>
        <p>Our website may contain links to external websites. We are not responsible for the privacy practices of these third-party sites.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">10. Changes to This Privacy Policy</h2>
        <p>We may update this policy from time to time. When we do, we will revise the 'Effective Date' at the top and notify users of significant changes.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">11. Contact Us</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>If you have any questions or concerns about this Privacy Policy, reach out to us at:</p>
          <p className="mt-2"><strong>Email:</strong> help@spacexec.com</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
