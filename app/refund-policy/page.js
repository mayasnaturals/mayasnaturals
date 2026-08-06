export const metadata = {
  title: "Return & Refund Policy | Maya's Naturals",
};

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-[#FDF0E0] pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm text-[rgba(43,27,20,0.8)]">
        <h1 className="text-4xl font-black mb-8 uppercase text-[#E8752A]" style={{ fontFamily: 'var(--font-display)' }}>
          Return, Refund & Cancellation Policy
        </h1>
        <div className="space-y-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          
          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Returns</h2>
          <p>Due to the nature of food products, all products sold by Maya's Naturals are non-returnable.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Refunds</h2>
          <p>Refunds will only be considered if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>An unboxing video recorded from the sealed package until opening is provided without any cuts or edits.</li>
            <li>The product is received damaged, defective or incorrect.</li>
          </ul>
          <p>Claims without a complete unboxing video may not be accepted.</p>
          <p>If approved, refunds will be processed to the original payment method within a reasonable processing period.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Order Cancellation</h2>
          <p>Orders may be cancelled only before dispatch. Once dispatched, cancellation is not possible.</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-[#2B1B14]">Food Product Disclaimer</h2>
          <ul className="list-disc pl-5 space-y-4">
            <li>Please read the ingredient list carefully before consumption.</li>
            <li>Products may contain or be processed in facilities handling cereals, nuts, seeds and dried fruits. Individuals with allergies should exercise caution.</li>
            <li>Nutritional values are approximate and may vary slightly between batches.</li>
            <li>Product images are for illustration purposes only.</li>
            <li>Store in a cool, dry place and keep the pack tightly sealed after opening.</li>
            <li>Maya's Naturals operates under a valid FSSAI Licence, and all products are manufactured and labelled in accordance with applicable food safety regulations.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
