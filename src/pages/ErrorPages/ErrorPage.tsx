import { useLanguage } from "../../context/LanguageContext.tsx";

function ErrorPage() {
  const { t } = useLanguage();

  return <div>{t("error.page")}</div>;
}

export default ErrorPage;
