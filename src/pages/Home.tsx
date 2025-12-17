//import type { MouseEvent } from "react";
import styles from "./Home.module.css";
import Rectangle from "../components/rectangle/rectangle1";
import { User } from "lucide-react"; // Example icons (optional)
import { Link } from "react-router-dom";

// Event handler
//const handleClick = (event: MouseEvent) => console.log(event);

export default function Home() {
  return (
    <>
      <div className={styles.rectangle_grid}>
        <Rectangle
          title="Welcome"
          caption="Quick start"
          image="quick_start.jpg"
        />

        <Link to="/colorpalettegenerator" 
        className={styles.link_text} 
        target="_blank" 
        rel="noopener noreferrer"
        >
          <Rectangle
            title="Color Palette"
            caption="Find the right colors for you"
            icon={<User />}
            image="palette_generator_launch.jpg"
          />
        </Link>

        <Link to="/colorpalettegenerator" 
        className={styles.link_text} 
        target="_blank" 
        rel="noopener noreferrer"
        >
          <Rectangle
            title="Explore Palettes"
            caption="Explore previously created color harmony"
            icon={<User />}
            image="palette_generator_launch.jpg"
          />
        </Link>

        <Rectangle
          title="Community"
          caption="Learn more about our mission. Get in touch"
          image="community_page.jpg"
        />
      </div>
    </>
  )
}

// useState hook: tells React that a component contains dynamic data/state 