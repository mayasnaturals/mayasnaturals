export const metadata = {
  title: "Privacy Policy | Maya's Naturals",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#FDF0E0] pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm text-[rgba(43,27,20,0.8)]">
        <h1 className="text-4xl font-black mb-8 uppercase text-[#E8752A]" style={{ fontFamily: 'var(--font-display)' }}>
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          <p><strong>Effective Date: August 5, 2026</strong></p>
          <p>Welcome to Maya's Naturals ("we", "our", "us"). We respect your privacy and are committed to protecting your personal information.</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Information We Collect</h2>
          <p>We may collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
            <li>Shipping & Billing Address</li>
            <li>Order Details</li>
            <li>Payment Information (processed securely through Razorpay)</li>
          </ul>
          <p>We do not store your debit/credit card details.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and deliver your orders.</li>
            <li>Provide customer support.</li>
            <li>Send order updates.</li>
            <li>Improve our website and services.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Cookies & Analytics</h2>
          <p>Our website may use cookies and analytics tools to improve user experience and understand website traffic.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Third-Party Services</h2>
          <p>We use trusted third-party providers including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Razorpay (Payment Processing)</li>
            <li>iCarry (Shipping & Delivery)</li>
          </ul>
          <p>These providers may process limited information necessary to complete your order.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Data Security</h2>
          <p>We take reasonable measures to protect your personal information. However, no online system is 100% secure.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Your Rights</h2>
          <p>You may request correction or deletion of your personal information by contacting us.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Contact</h2>
          <p>For any privacy-related questions, please contact us using the details provided on www.mayasnaturals.in.</p>
        </div>
      </div>
    </main>
  );
}
