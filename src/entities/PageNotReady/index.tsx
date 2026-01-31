import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const PageNotReady = () => {
  const { t } = useTranslation();
  return (
    <section
      className="grid min-h-[calc(100vh-190px)] content-center"
      aria-labelledby="minimal-title"
    >
      <div className="placeholder minimal">
        <div className="ph-content">
          <div className="ph-eyebrow">🚧 {t("page_block.top_text")}</div>
          <h2 id="minimal-title" className="ph-title">
            {t("page_block.title")}
          </h2>
          <div className="ph-actions">
            <Link to={"/"} className="btn btn-ghost">
              ⬅ {t("page_block.link")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
