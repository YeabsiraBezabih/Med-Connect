import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal identification information (Name, email address, phone number)</li>
            <li>Medical history and prescription information</li>
            <li>Pharmacy-related information for registered pharmacies</li>
            <li>Communication data between users and pharmacies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the collected information for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing and improving our services</li>
            <li>Processing prescriptions and orders</li>
            <li>Communication between users and pharmacies</li>
            <li>Ensuring platform security and preventing fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information.
            All data is encrypted and stored securely following industry standards.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            support@medconnect.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 