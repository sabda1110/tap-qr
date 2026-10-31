import { useI18n } from "../../i18n";
import { ReviewGuideArticle } from "../organisms/review-guide-article";

export function GoogleReviewGuidePage() {
  const { language, messages } = useI18n();
  return <ReviewGuideArticle language={language} content={messages.reviewGuide} />;
}
