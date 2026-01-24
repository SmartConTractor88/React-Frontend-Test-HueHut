import { usePageTitle } from "../components/hooks/usePageTitle";

export default function Community() {
  
  // tab header
  usePageTitle("Community | HueHut")
  
  const items: string[] = ["red", "white", "green"];

  return (
    <> 
      <h1>Contact HueHut.net</h1>    
      {items.length === 0 && <p>Nothing</p>}
      <ul className="test_list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}