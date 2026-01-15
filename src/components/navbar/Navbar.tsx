import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link className={styles.link_text} to="/">
            <div className={styles.logo_wrapper}>
                <p className={styles.navbar_logo}>HueHut</p>
                <img src="/HueHut_drop.png" alt="" className={styles.logo_drop}/>
            </div>
            </Link>

            <div className={styles.navbar_buttons}>
                <button 
                className={[styles.button, styles.nav_button1].join(" ")} 
                onClick={() => console.log("CLICKED")}
                >
                    <NavLink to="/">
                        Home
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.nav_button2].join(" ")} 
                onClick={() => console.log("CLICKED")}
                >
                    <NavLink to="/">
                        Palettes
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.nav_button3].join(" ")}
                >
                    <NavLink to="/">
                        Community
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.nav_button4].join(" ")}>
                    <NavLink to="/">
                        Sign In
                    </NavLink>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

