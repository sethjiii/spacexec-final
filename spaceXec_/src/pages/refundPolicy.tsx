import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Refund & Cancellation Policy - SpaceXec</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">1. Refund Eligibility</h2>
        <p>Refunds are only available if the investment has not been finalized or completed on SpaceXec.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">2. Cancellation of Investment</h2>
        <p>Users may cancel their investment request before it is finalized or the agreement is signed.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">3. Refund Options</h2>
        <p>Once approved, users can choose to receive their refund either:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>To their original payment method (e.g., Razorpay, Stripe, PayPal)</li>
          <li>Credited to their SpaceXec wallet for future use.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">4. Refund Processing Time</h2>
        <p>Refunds will be processed within 3 to 5 business days after approval. The exact time may vary depending on the payment method used.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold border-b pb-2 mb-2">5. Contact</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>For questions regarding refunds or cancellations, contact us at: <strong>help@spacexec.com</strong></p>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
