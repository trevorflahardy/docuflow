function MockBannerLink(): React.ReactElement {
    return (
        <>
            <div className={`px-3 py-2 rounded-md text-gray-600`}>
                Content
            </div>
        </>
    )
}

export default function Banner(): React.ReactElement {
  return (
      <>
          {/* Holds the global docuflow app banner. Will contain any links given from the settings, such as github and whatnot, and other links.*/}
          <div className="w-full p-4 flex flex-row items-center justify-end gap-5">
              {/* For now, we'll keep a couple place holder boxes here for what it would look like. */}
                <MockBannerLink /> 
                <MockBannerLink /> 
                <MockBannerLink /> 
          </div>
    </>
  )
}