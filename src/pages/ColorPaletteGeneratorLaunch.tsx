import type { MouseEvent } from "react";
import styles from "./ColorPaletteGeneratorLaunch.module.css";
import { NavLink } from "react-router-dom";

export default function ColorPaletteGeneratorLaunch() {
    const name = "Billy";

    // Event handler2
    const handleClick = (event: MouseEvent) => console.log(event);
    return (
        <>
            <h1 onClick={handleClick}> Find the right colors for you, {name} </h1>
            <button className={styles.button_launch}><NavLink to="/colorpalettegenerator" target="_blank" rel="noopener noreferrer">Start</NavLink></button>
        </>
    );
}