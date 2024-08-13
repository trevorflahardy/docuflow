import { useEffect, useState } from "react";
import Config, { ModuleConfig, fileNameToDisplayName } from '../../../docuflow/config';
import { Link } from "react-router-dom";

function SidebarModule({ config, module }: {config: Config, module: ModuleConfig }): React.ReactElement {
    const submodules = module.submodules;
    const files = module.files;
    const hasIndex = files && files.includes("index.mdx");

    return (
        <>
            <div className="font-semibold text-black mt-2 hover:text-slate-700 transition-colors duration-500 ease-out">
                {
                    hasIndex ? (
                        <Link to={config.createFilePath(module, "index.mdx")}>
                            {module.name}
                        </Link>
                    ) : (
                        <>
                            {module.name}
                        </>
                    )
                }
            </div>

            {/* The module's items and submodules -> Has a bar down the left side of it, and contains any sub-modules nested in it. */}
            <div className="w-full border-l border-gray-400 pl-3 !mt-1">
                {
                    files && files.filter((file) => {
                        return file.toLowerCase() !== "index.mdx";
                    }).map((file) => (
                        <div key={file} className="text-slate-800 text-sm hover:text-black hover:border-black transition-colors duration-200 ease-out">
                            <Link to={config.createFilePath(module, file)}>
                                {fileNameToDisplayName(file)}
                            </Link>
                        </div>    
                    ))
                }
                
                {
                    submodules && submodules.map((submodule) => (
                        <SidebarModule key={submodule.index} config={config} module={submodule} />
                    ))
                }
            </div>
        </>
    )
}

/**
 * TODO; Some sort of passing to this sidebar for dynamic modules and whatnot.
 */
export default function Sidebar(): React.ReactElement {
    const [config, setConfig] = useState(null as Config | null);

    // Load the config file
    useEffect(() => {
        (async () => {
            const config = await Config.load();
            setConfig(config);
        })()
    }, []);

    // The sidebar for this app. Contains navigation, searching, etc.
    return (
        <>
            <div className="w-fit px-3 min-w-64 py-5 space-y-3 overflow-y-auto border-r border-slate-200">
                {/* Holds the search bar which is always pinned at the top while scrolling down */}
                <div className="py-2 px-4 rounded-full text-xs font-light bg-slate-100">
                    Search Placeholder
                </div>

                {/* The sidebar content below the pinned search bar*/}
                {
                    config ? config.modules.map((module) => (
                        <SidebarModule key={module.index} config={config} module={module} />
                    )) : <p>Loading...</p>
                }
            </div>

        </>
    )
}