import React from "react";

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Website Disclaimer - SpaceXec</h1>
      <p className="mb-6">
        This disclaimer outlines the terms and conditions for using the SpaceXec platform. By accessing or using our
        platform, you acknowledge and agree to comply with these terms. If you do not agree with any part of this
        disclaimer, please refrain from using our services.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">1. General Information and Platform Purpose</h2>
        <p>SpaceXec operates as an online platform facilitating fractional ownership of premium real estate properties, allowing users to buy and sell fractions of such properties.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">2. Investment Risks and Liability</h2>
        <p>
          Investing in real estate through SpaceXec involves inherent risks, including but not limited to market
          conditions and property performance. Users should be aware that investment involves risk, including the
          possible loss of principal. SpaceXec is not liable for any financial losses incurred due to market conditions,
          property performance, or user negligence. Users are strongly advised to invest responsibly and carefully review
          all investment agreements before making any investment decisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">3. User Eligibility and Compliance</h2>
        <p>
          To use the SpaceXec platform, users must be at least 18 years of age and legally eligible to invest in real
          estate under applicable laws. All users are required to complete Know Your Customer (KYC) verification by
          submitting valid documents, such as PAN and Aadhar, before participating in any investment.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">4. Transaction Fees and Agreements</h2>
        <p>
          All transactions conducted on SpaceXec may be subject to processing fees, which will be displayed before the
          completion of any investment or purchase. Users are required to digitally sign an investment agreement before
          finalizing any property investment. This agreement outlines the terms of ownership, responsibilities, and risk
          disclosure related to the specific property.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">5. Exclusion of Professional Advice</h2>
        <p>
          Please note that SpaceXec, its employees, or agents do not provide legal, accounting, or tax advice. The
          information provided on this platform is for general informational purposes only and should not be considered
          personalized financial, investment, legal, or tax advice. Users are strongly advised to consult with appropriate
          independent professional counsel, such as legal professionals, tax advisors, or financial experts, for advice
          tailored to their specific situation before making any investment decisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">6. Accuracy of Information</h2>
        <p>
          While SpaceXec strives to provide accurate and up-to-date information, all financial products, shopping
          products, and services are presented without warranty. Information regarding specific real estate laws, tax
          rates, and market dynamics is based on general knowledge and interpretation of available sources. Users should
          consult official government sources, legal professionals, tax advisors, and up-to-date market reports for the
          most current and accurate information relevant to their specific transactions or concerns.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">7. Prohibited Activities</h2>
        <p>
          Users agree not to engage in fraudulent activities, submit false documents, spam, or misuse the platform. Any
          violation of these terms may result in temporary suspension or permanent termination of the account, blocking
          access to future investments, or legal action and reporting to authorities in serious cases.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, SpaceXec shall not be liable for any direct, indirect, incidental,
          special, or consequential damages resulting from the use of, or inability to use, the platform. This includes but
          is not limited to loss of data, loss of profits, or interruption of business operations.
        </p>
      </section>
    </div>
  );
};

export default Disclaimer;
