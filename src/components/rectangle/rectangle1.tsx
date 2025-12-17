import styles from "./rectangle1.module.css"

interface RectangleProps {
  title: string;       // required
  caption: string;     // required
  icon?: React.ReactNode; // optional
  image?: string; // URL of the background image, optional
}


export default function Rectangle({ title, caption, icon, image }: RectangleProps) {
  return (
    <div className={styles.rectangle}
      style={
        image
          ? { "--bg-image": `url(${image})` } as React.CSSProperties
          : undefined
      }
    >
      <h1>{title}</h1>
      <h3>{caption}</h3>
      {icon && <div className="icon">{icon}</div>}

    </div>
  );
}
