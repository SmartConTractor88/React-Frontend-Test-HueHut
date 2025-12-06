import styles from "./ColorPaletteGeneratorLaunch.module.css";
import { NavLink } from "react-router-dom";

export default function ColorPaletteGeneratorLaunch() {
    return (
        <>
            <h1> Find the right colors for you. </h1>
            <button className={styles.button_launch}><NavLink to="/colorpalettegenerator" target="_blank" rel="noopener noreferrer">Start</NavLink></button>
        </>
    );
}