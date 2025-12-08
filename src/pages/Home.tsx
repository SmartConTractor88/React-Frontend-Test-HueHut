//import type { MouseEvent } from "react";
import styles from "./Home.module.css";
import Rectangle from "../components/rectangle/rectangle1";
import { User } from "lucide-react"; // Example icons (optional)

// Event handler
//const handleClick = (event: MouseEvent) => console.log(event);

export default function Home() {
  return (
    <>
      <div className={styles.rectangle_grid}>
      <Rectangle
        title="Welcome"
        caption="Quick start"
      />

      <Rectangle
        title="Color Palette"
        caption="Find the right colors for you"
        icon={<User />}  
      />

      <Rectangle
        title="Community"
        caption="Learn more about our mission. Get in touch"
      />
    </div>
    </>
  )
}

// useState hook: tells React that a component contains dynamic data/state 