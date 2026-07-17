import { getProducts } from "@/lib/shopify";
// import ContactWheel from "./ContactWheel";
import { Mail, Phone, MapPin } from "lucide-react";
import s from "./contact.module.css";

export const metadata = {
  title: "Contact Us | Maya",
  description: "Get in touch with the Maya team.",
};

export default async function ContactPage() {
  /*
  const shopifyProducts = await getProducts(50);
  
  const formattedProducts = (shopifyProducts || []).map((p) => {
    const firstVariant = p.variants?.edges[0]?.node;
    return {
      id: firstVariant?.id || p.id,
      handle: p.handle,
      name: p.title,
      type: p.productType || "Product",
      price: parseFloat(p.priceRange?.minVariantPrice?.amount || 0),
      description: p.description,
      badge: p.badge?.value || null,
      newness: parseInt(p.newness?.value) || 5,
      image: p.images?.edges[0]?.node?.url || "/products/Default Museli.png",
      weight: firstVariant?.weight ? `${firstVariant.weight}${firstVariant.weightUnit.toLowerCase()}` : "400g",
      colors: [
        p.colorDark?.value || "#2A1A10", 
        p.colorMid?.value || "#E8752A", 
        p.colorLight?.value || "#FFF8F0"
      ],
    };
  });
  */

  return (
    <main className={s.page}>
      <section className={s.hero}>
        <div className={s.heroTexture} />
        <div className={s.heroInner}>
          <p className={s.heroKicker}>Say Hello</p>
          <h1 className={s.heroTitle}>Get in touch</h1>
          <p className={s.heroDesc}>
            Questions about our muesli? Want to stock Maya in your store? Or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className={s.content}>
        <div className={s.infoBlock}>
          <div className={s.infoGroup}>
            <a href="mailto:mayasnaturals.india@gmail.com" className={`${s.infoText} ${s.infoLink}`}>
              <Mail size={24} color="var(--orange)" strokeWidth={2.5} className={s.inlineIcon} />
              mayasnaturals.india@gmail.com
            </a>
          </div>

          <div className={s.infoGroup}>
            <a href="tel:+918918793380" className={`${s.infoText} ${s.infoLink}`}>
              <Phone size={24} color="var(--orange)" strokeWidth={2.5} className={s.inlineIcon} />
              +91 8918-793-380
            </a>
          </div>

          <div className={s.infoGroup}>
            <h3 className={s.infoText}>
              <MapPin size={24} color="var(--orange)" strokeWidth={2.5} className={s.inlineIcon} />
              Maya's Naturals
            </h3>
            <p className={s.infoAddress}>
              109 Rathtala, Bhattacharya Colony, <br />Purba Barddhaman,
              West Bengal, <br></br>India - 713101
            </p>
          </div>
        </div>

        <div className={s.mapBlock}>
          <iframe
            src="https://maps.google.com/maps?q=109+Rathtala,+Bhattacharya+Colony,+Purba+Barddhaman,+West+Bengal,+India+-+713101&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className={s.mapIframe}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* <ContactWheel products={formattedProducts} /> */}
    </main>
  );
}
