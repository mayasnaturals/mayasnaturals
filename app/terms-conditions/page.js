export const metadata = {
  title: "Terms & Conditions | Maya's Naturals",
};

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[#FDF0E0] pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm text-[rgba(43,27,20,0.8)]">
        <h1 className="text-4xl font-black mb-8 uppercase text-[#E8752A]" style={{ fontFamily: 'var(--font-display)' }}>
          Terms & Conditions
        </h1>
        <div className="space-y-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Acceptance</h2>
          <p>By accessing or using this website, you agree to these Terms & Conditions.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Products</h2>
          <p>All products sold by Maya's Naturals are food products intended for personal consumption.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Product Information</h2>
          <p>We make every effort to ensure product descriptions, ingredients and pricing are accurate. Minor variations may occur.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Pricing</h2>
          <p>Prices are displayed in Indian Rupees (INR) and may change without prior notice.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Orders</h2>
          <p>We reserve the right to accept, reject or cancel any order due to stock availability, pricing errors, suspected fraud or other operational reasons.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Intellectual Property</h2>
          <p>All website content including logos, images, product names, designs and text belongs to Maya's Naturals and may not be copied without written permission.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Limitation of Liability</h2>
          <p>Our liability shall be limited to the value of the purchased product. We shall not be liable for indirect or consequential damages.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Governing Law</h2>
          <p>These Terms & Conditions shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in India.</p>
        </div>
      </div>
    </main>
  );
}
