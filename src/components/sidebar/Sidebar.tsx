/**
 * TODO; Some sort of passing to this sidebar for dynamic modules and whatnot.
 */
export default function Sidebar(): React.ReactElement {
    // The sidebar for this app. Contains navigation, searching, etc.
    return (
        <>
            <div className="basis-1/5 px-3 py-5 space-y-3 overflow-y-auto border-r border-slate-200">
                {/* Holds the search bar which is always pinned at the top while scrolling down */}
                <div className="py-2 px-4 rounded-full text-xs font-light bg-slate-100">
                    Search Placeholder
                </div>

                {/* The sidebar content below the pinned search bar*/}
                <div className="leading-loose space-y-50">
                    {/* TODO: This must be moved to dynamic component */}
                    <div>
                        {/* Similar to tailwindcss.com's sidebar */}
                        <p className="font-semibold mb-1 text-black">
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