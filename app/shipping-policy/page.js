export const metadata = {
  title: "Shipping Policy | Maya's Naturals",
};

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-[#FDF0E0] pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm text-[rgba(43,27,20,0.8)]">
        <h1 className="text-4xl font-black mb-8 uppercase text-[#E8752A]" style={{ fontFamily: 'var(--font-display)' }}>
          Shipping Policy
        </h1>
        <div className="space-y-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          <ul className="list-disc pl-5 space-y-4">
            <li>Orders are generally dispatched within 2 business days.</li>
            <li>Delivery timelines may vary depending on the destination and courier operations.</li>
            <li>Shipping charges, if applicable, will be displayed during checkout.</li>
            <li>Delivery is available only in serviceable locations.</li>
            <li>Delays due to weather, public holidays, natural disasters or courier issues are beyond our control.</li>
            <li>If a shipment is lost or damaged in transit, customers should contact us immediately for assistance.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
