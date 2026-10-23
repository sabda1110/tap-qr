import { CreditCard, Crown, ScanLine } from "lucide-react";
import heroShot from "../assets/images/heroshot-feature-style-v2.webp";
import cloudMascot from "../assets/images/tapqr-cloud-mascot.webp";
import customerHubImage from "../assets/images/features/customer-hub.png";
import flexibleNfcQrImage from "../assets/images/features/flexible-nfc-qr.png";
import reviewGrowthImage from "../assets/images/features/review-growth.png";
import scanAnalyticsImage from "../assets/images/features/scan-analytics.png";
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
              },
              {
                content: messages.features.customerHub,
                imageSrc: customerHubImage,
              },
              {
                content: messages.features.flexibleNfcQr,
                imageSrc: flexibleNfcQrImage,
              },
              {
                content: messages.features.scanAnalytics,
                imageSrc: scanAnalyticsImage,
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
              { content: messages.pricing.pvcCard, icon: CreditCard, order: true },
              {
                content: messages.pricing.acrylicBoard,
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
