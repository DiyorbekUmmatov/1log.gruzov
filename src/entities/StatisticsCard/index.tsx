import styles from "./style.module.css";

interface StatisticsProps {
  value?: number;
  text: string;
  icon: React.ReactElement;
}

export const StatisticsCard: React.FC<StatisticsProps> = ({ value, text, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.card_top}>
        <span>{typeof value === "number" ? value.toLocaleString() : "—"}</span>
        {icon}
      </div>
      <div>{text}</div>
    </div>
  );
};
