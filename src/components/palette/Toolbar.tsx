import styles from "./Toolbar.module.css";

type Props = {
  onGenerate: () => void;
  onCopy?: () => void;
  onSave?: () => void;
};

export default function Toolbar({
  onGenerate,
  onCopy,
  onSave
}: Props) {
  return (
    <div className={styles.toolbar}>
      <button onClick={onGenerate}>Generate</button>

      <button onClick={onCopy} disabled={!onCopy}>
        Copy
      </button>

      <button onClick={onSave} disabled={!onSave}>
        Save
      </button>
    </div>
  );
}
