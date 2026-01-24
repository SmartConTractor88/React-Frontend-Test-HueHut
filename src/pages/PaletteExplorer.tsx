import { usePageTitle } from "../components/hooks/usePageTitle";
import styles from "./PaletteExplorer.module.css";

export default function PaletteExplorer() {

    // tab header
    usePageTitle("Explore Palettes | HueHut")

    return (
        <>
            <h1 className={styles.title}>Explore Palettes</h1>
        </>
    )
}