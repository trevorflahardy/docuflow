import Banner from "./Banner";
import Hero from "./Hero";

function App() {
  return (
    <>
      {/* The container for the entire app. Holds the header, navigation, etc. */}
      <div className="antialiased">
        <Banner />
        <Hero />
      </div>
    </>
  )
}

export default App
