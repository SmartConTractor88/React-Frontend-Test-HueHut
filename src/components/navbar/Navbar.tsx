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
                className={[styles.button, styles.home_button].join(" ")} 
                onClick={() => console.log("CLICKED")}
                >
                    <NavLink to="/colorpalettegenerator">
                        Generator
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.home_button].join(" ")} 
                onClick={() => console.log("CLICKED")}
                >
                    <NavLink to="/">
                        Home
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.community_button].join(" ")}
                >
                    <NavLink to="/community">
                        Community
                    </NavLink>
                </button>

                <button 
                className={[styles.button, styles.contact_button].join(" ")}>
                    <NavLink to="/community">
                        Sign In
                    </NavLink>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

