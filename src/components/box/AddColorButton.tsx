import styles from "./AddColorButton.module.css";

type Props = {
  onClick: () => void;
  visible: boolean;
};

export default function AddColorButton({ onClick, visible }: Props) {
  return (
    <div
      className={`${styles.plus_button} ${visible ? styles.visible : ""}`}
      onClick={onClick}
    >
      +
    </div>
  );
}

