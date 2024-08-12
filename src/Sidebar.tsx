/**
 * TODO; Some sort of passing to this sidebar for dynamic modules and whatnot.
 */
export default function Sidebar(): React.ReactElement {
    // The sidebar for this app. Contains navigation, searching, etc.
    return (
        <>
            <div className="w-full h-full relative basis-1/5 px-3 py-5 space-y-3"  >
                <div className="w-full h-full overflow-y-scroll">
                    {/* Holds the search bar which is always pinned at the top while scrolling down */}
                    <div className="py-2 px-4 bg-gray-200 text-gray-600 rounded-full text-xs font-light">
                        Search Placeholder
                    </div>
                </div>

                {/* The sidebar content below the pinned search bar*/}
                <div className="leading-loose">
                    {/* TODO: This must be moved to dynamic component */}
                    <div>
                        {/* Similar to tailwindcss.com's sidebar */}
                        <p className="font-semibold mb-1">
                            Module Name
                        </p>

                        {/* The module's items -> Has a bar down the left side of it*/}
                        <div>
                            <p className="border-l border-gray-500 pl-3 text-gray-500 text-sm hover:text-black hover:border-black transition-colors duration-200 ease-out">
                                Module Subitem
                            </p>
                            <p className="border-l border-gray-500 pl-3 text-gray-500 text-sm hover:text-black hover:border-black transition-colors duration-200 ease-out">
                                Module Subitem
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}