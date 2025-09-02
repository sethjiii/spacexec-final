import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Terms & Conditions</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using SpaceXec, you agree to comply with and be bound by these
          Terms & Conditions. If you do not agree, please do not use our platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">2. Eligibility</h2>
        <p>
          You must be at least 18 years of age to use SpaceXec. By registering, you confirm
          that you are legally eligible to invest in real estate in accordance with applicable laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">3. KYC and Identity Verification</h2>
        <p>
          Before participating in any investment on SpaceXec, you are required to complete
          Know Your Customer (KYC) verification by submitting valid documents such as PAN and Aadhar.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">4. Transaction and Processing Fees</h2>
        <p>
          All transactions made on SpaceXec may be subject to a processing fee. These charges will
          be clearly displayed prior to the completion of any investment or purchase.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">5. Investment Agreement</h2>
        <p>
          Users must digitally sign an investment agreement before finalizing any property investment.
          This agreement outlines the terms of ownership, responsibilities, and risk disclosure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">6. Prohibited Activities</h2>
        <p>Users agree not to engage in fraudulent activities, submit false documents, spam, or misuse the platform. Any violation may lead to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Temporary suspension of the account</li>
          <li>Permanent termination of the account</li>
          <li>Blocking access to future investments</li>
          <li>Legal action or reporting to authorities in serious cases</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">7. Changes to Terms</h2>
        <p>
          SpaceXec reserves the right to modify these Terms & Conditions at any time. Updated terms
          will be posted on the website and become effective immediately upon posting.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">8. Limitation of Liability</h2>
        <p>
          SpaceXec is not liable for any financial losses incurred due to market conditions,
          property performance, or user negligence. Users are advised to invest responsibly and review all agreements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">9. Contact Information</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>
            If you have questions about these Terms & Conditions, contact us at:
            <strong> help@spacexec.com</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
