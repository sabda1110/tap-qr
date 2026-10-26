import { CreditCard, Crown, ScanLine } from "lucide-react";
import heroShot from "../assets/images/heroshot-feature-style-v2.webp";
import cloudMascot from "../assets/images/tapqr-cloud-mascot.webp";
import customerHubImage from "../assets/images/features/customer-hub-520.webp";
import customerHubLarge from "../assets/images/features/customer-hub-1040.webp";
import flexibleNfcQrImage from "../assets/images/features/flexible-nfc-qr-520.webp";
import flexibleNfcQrLarge from "../assets/images/features/flexible-nfc-qr-1040.webp";
import reviewGrowthImage from "../assets/images/features/review-growth-520.webp";
import reviewGrowthLarge from "../assets/images/features/review-growth-1040.webp";
import scanAnalyticsImage from "../assets/images/features/scan-analytics-520.webp";
import scanAnalyticsLarge from "../assets/images/features/scan-analytics-1040.webp";
import { HomeLayout } from "../layouts/home-layout";
import { HeroSection } from "../organisms/hero-section";
import { KeyFeaturesSection } from "../organisms/key-features-section";
import { PricingSection } from "../organisms/pricing-section";
import { SiteFooter } from "../organisms/site-footer";
import { SiteHeader } from "../organisms/site-header";
import { TestimonialsSection } from "../organisms/testimonials-section";
import { LandingFaqSection } from "../organisms/landing-faq-section";
import { ProductShowcaseSection } from "../organisms/product-showcase-section";
import { ProductDisplay } from "../molecules/product-display";
import { useI18n } from "../../i18n";

export function HomePage({ whatsappNumber }: { whatsappNumber: string | null }) {
  const { language, messages } = useI18n();

  return (
    <HomeLayout
      header={<SiteHeader content={messages.header} language={language} />}
      hero={
        <HeroSection
          content={messages.home}
          imageSrc={heroShot}
        />
      }
      footer={<SiteFooter content={messages.footer} language={language} />}
      content={
        <>
          <KeyFeaturesSection
            heading={messages.features.heading}
            features={[
              {
                content: messages.features.reviewGrowth,
                imageSrc: reviewGrowthImage,
                imageSrcSet: `${reviewGrowthImage} 520w, ${reviewGrowthLarge} 1040w`,
              },
              {
                content: messages.features.customerHub,
                imageSrc: customerHubImage,
                imageSrcSet: `${customerHubImage} 520w, ${customerHubLarge} 1040w`,
              },
              {
                content: messages.features.flexibleNfcQr,
                imageSrc: flexibleNfcQrImage,
                imageSrcSet: `${flexibleNfcQrImage} 520w, ${flexibleNfcQrLarge} 1040w`,
              },
              {
                content: messages.features.scanAnalytics,
                imageSrc: scanAnalyticsImage,
                imageSrcSet: `${scanAnalyticsImage} 520w, ${scanAnalyticsLarge} 1040w`,
              },
            ]}
          />
          <ProductShowcaseSection
            content={messages.productShowcase}
            preview={<ProductDisplay content={messages.adminDashboard.printStudio} mascotSrc={cloudMascot} benefits={messages.productShowcase.mascotBenefits} />}
          />
          <PricingSection
            heading={messages.pricing.heading}
            language={language}
            note={messages.pricing.note}
            plans={[
              { content: messages.pricing.pvcCard, icon: CreditCard, order: true, material: "pvc" },
              {
                content: messages.pricing.acrylicBoard,
                material: "acrylic",
                icon: ScanLine,
                featured: true,
                order: true,
              },
              {
                content: messages.pricing.businessBundle,
                icon: Crown,
                royal: true,
                externalHref: whatsappNumber
                  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      messages.pricing.businessBundle.whatsappMessage,
                    )}`
                  : null,
              },
            ]}
          />
          <TestimonialsSection
            heading={messages.testimonials.heading}
            ratingLabel={messages.testimonials.ratingLabel}
            testimonials={[
              messages.testimonials.coffeeShop,
              messages.testimonials.barbershop,
              messages.testimonials.laundry,
            ]}
          />
          <LandingFaqSection
            content={messages.faq}
            contactHref={whatsappNumber ? `https://wa.me/${whatsappNumber}` : null}
          />
        </>
      }
    />
  );
}
