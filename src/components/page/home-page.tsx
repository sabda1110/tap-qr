import { Nfc, Printer, ScanLine } from "lucide-react";
import heroShot from "../assets/images/heroshot.svg";
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
import { useI18n } from "../../i18n";

export function HomePage() {
  const { language, messages } = useI18n();

  return (
    <HomeLayout
      header={<SiteHeader content={messages.header} language={language} />}
      hero={
        <HeroSection
          content={messages.home}
          imageSrc={heroShot}
          language={language}
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
          <PricingSection
            heading={messages.pricing.heading}
            language={language}
            note={messages.pricing.note}
            plans={[
              { content: messages.pricing.selfPrint, icon: Printer },
              {
                content: messages.pricing.qrBoard,
                icon: ScanLine,
                featured: true,
              },
              { content: messages.pricing.nfcBundle, icon: Nfc },
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
        </>
      }
    />
  );
}
