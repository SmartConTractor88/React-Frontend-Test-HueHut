import { useMemo } from "react";
import { usePageTitle } from "../components/hooks/usePageTitle";
import styles from "./Home.module.css";
import Rectangle from "../components/rectangle/rectangle1";
import { Link } from "react-router-dom";
import { FaPaintBrush, FaArrowRight } from "react-icons/fa";

const wallpapers = [
  "wallpapers/wallpaper-01.jpg",
  "wallpapers/wallpaper-02.jpg",
  "wallpapers/wallpaper-03.jpg",
  "wallpapers/wallpaper-04.jpg",
  "wallpapers/wallpaper-05.jpg",
  "wallpapers/wallpaper-06.jpg",
  "wallpapers/wallpaper-07.jpg",
  "wallpapers/wallpaper-08.jpg",
  "wallpapers/wallpaper-09.jpg",
  "wallpapers/wallpaper-10.jpg",
];

export default function Home() {
  
  // tab header
  usePageTitle("Home | HueHut");

  // pick a random wallpaper once per mount
  const wallpaper = useMemo(
    () => wallpapers[Math.floor(Math.random() * wallpapers.length)],
    []
  );
  
  return (
    <div
      className={styles.wallpaper}
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className={styles.rectangle_grid}>
        <Rectangle
          title="Welcome"
          caption="Quick start"
          icon={<FaArrowRight />}
        />

        <Link to="/colorpalettegenerator" 
        className={styles.link_text} 
        >
          <Rectangle
            title="Palette Generator"
            caption="Find the right colors for you"
            icon={<FaPaintBrush />}
          />
        </Link>

        <Link to="/paletteexplorer" 
        className={styles.link_text}
        >
          <Rectangle
            title="Explore Palettes"
            caption="Explore previously created color harmony"
            icon={<FaArrowRight />}
          />
        </Link>

        <Link to="/community" 
        className={styles.link_text}
        >
        <Rectangle
          title="Community"
          caption="Learn more about our mission. Get in touch"
          icon={<FaArrowRight />}
        />
        </Link>
      </div>
    </div>
  )
}

// useState hook: tells React that a component contains dynamic data/state 