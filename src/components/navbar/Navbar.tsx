import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <button className={styles.button} onClick={() => console.log("CLICKED")}><NavLink to="/">Home</NavLink></button>
            <button className={styles.button}><NavLink to="/colorpalettegeneratorlaunch">Color Palette Generator Launcher</NavLink></button>
            <button className={styles.button}><NavLink to="/community">Community</NavLink></button>
        </nav>
    );
}

export default Navbar;

