import { useI18n } from "../../i18n";
import { AuthLayout, type AuthMode } from "../layouts/auth-layout";
import { AuthForm } from "../organisms/auth-form";
import { AuthHeader } from "../organisms/auth-header";
import { AuthShowcase } from "../organisms/auth-showcase";

type AuthPageProps = {
  mode: AuthMode;
};

export function AuthPage({ mode }: AuthPageProps) {
  const { language, messages } = useI18n();
  const authContent = messages.auth[mode];
  return (
    <AuthLayout
      mode={mode}
      header={
        <AuthHeader
          backLabel={messages.auth.backHome}
          brandHomeLabel={messages.header.brandHomeLabel}
          language={language}
          languageLabel={messages.auth.languageLabel}
        />
      }
      showcase={
        <AuthShowcase
          content={{
            kicker: authContent.showcaseKicker,
            title: authContent.showcaseTitle,
            description: authContent.showcaseDescription,
            benefits: authContent.benefits,
          }}
        />
      }
      form={
        <AuthForm
          content={authContent}
          feedback={messages.auth}
          language={language}
          mode={mode}
        />
      }
    />
  );
}
