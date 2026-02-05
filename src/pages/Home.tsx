//import type { MouseEvent } from "react";
import { usePageTitle } from "../components/hooks/usePageTitle";
import styles from "./Home.module.css";
import Rectangle from "../components/box/rectangle1";
import { Link } from "react-router-dom";
import { FaPaintBrush, FaArrowRight } from "react-icons/fa";



// Event handler
//const handleClick = (event: MouseEvent) => console.log(event);

export default function Home() {
  
  // tab header
  usePageTitle("Home | HueHut");
  
  return (
    <>
      <div className={styles.rectangle_grid}>
        <Rectangle
          title="Welcome"
          caption="Quick start"
          image="quick_start.jpg"
          icon={<FaArrowRight />}
        />

        <Link to="/colorpalettegenerator" 
        className={styles.link_text} 
        >
          <Rectangle
            title="Palette Generator"
            caption="Find the right colors for you"
            icon={<FaPaintBrush />}
            image="palette_generator_launch.jpg"
          />
        </Link>

        <Link to="/paletteexplorer" 
        className={styles.link_text}
        >
          <Rectangle
            title="Explore Palettes"
            caption="Explore previously created color harmony"
            icon={<FaArrowRight />}
            image="explore_page.jpg"
          />
        </Link>

        <Link to="/community" 
        className={styles.link_text}
        >
        <Rectangle
          title="Community"
          caption="Learn more about our mission. Get in touch"
          icon={<FaArrowRight />}
          image="community_page.jpg"
        />
        </Link>
      </div>
    </>
  )
}

// useState hook: tells React that a component contains dynamic data/state 