import styles from "./rectangle1.module.css"

interface RectangleProps {
  title: string;       // required
  caption: string;     // required
  icon?: React.ReactNode; // optional
  color?: string; // optional background color override
}


export default function Rectangle({ title, caption, icon, color }: RectangleProps) {
  return (
    <div
      className={styles.rectangle}
      style={color ? { backgroundColor: color } : undefined}
    >
      <h1>{title}</h1>
      <h3>{caption}</h3>
      {icon && <div className={styles.icon}>{icon}</div>}

    </div>
  );
}
