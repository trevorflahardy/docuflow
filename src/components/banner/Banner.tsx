function MockBannerLink(): React.ReactElement {
    return (
        <>
            <div className={`px-3 py-2 rounded-md text-gray-600 font-medium`}>
                Content
            </div>
        </>
    )
}

export default function Banner(): React.ReactElement {
  return (
      <>
          {/* Holds the global docuflow app banner. Will contain any links given from the settings, such as github and whatnot, and other links.*/}
          <header className="w-full p-2 flex flex-row items-center justify-end gap-3 border-b border-slate-200">
              {/* For now, we'll keep a couple place holder boxes here for what it would look like. */}
                <MockBannerLink /> 
                <MockBannerLink /> 
                <MockBannerLink /> 
          </header>
    </>
  )
}