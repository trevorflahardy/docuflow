import Banner from "./components/banner/Banner";
import MainContent from "./MainContent";

function Docs() {
  return (
    <>
      {/* The container for the entire app. Holds the header, navigation, etc. */}
      <div className="antialiased text-slate-700 bg-white">
        <Banner />
        <MainContent />
      </div>
    </>
  )
}

export default Docs
