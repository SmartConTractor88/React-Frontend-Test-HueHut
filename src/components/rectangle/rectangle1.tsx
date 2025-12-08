import styles from "./rectangle1.module.css"

interface RectangleProps {
  title: string;       // required
  caption: string;     // required
  icon?: React.ReactNode; // optional
}


export default function Rectangle({ title, caption, icon }: RectangleProps) {
  return (
    <div className={styles.rectangle}>
      <h2>{title}</h2>
      <p>{caption}</p>
      {icon && <div className="icon">{icon}</div>}
    </div>
  );
}

// the icon is not required
