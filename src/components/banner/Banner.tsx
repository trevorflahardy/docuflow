import projectConfigOptions from "../../docuflow.config";
import { FaGithub } from "react-icons/fa";

function MockBannerLink(): React.ReactElement {
    return (
        <>
            <div className={`px-3 py-2 rounded-md text-gray-600 font-medium`}>
                Content
            </div>
        </>
    );
}

function BannerElement({
    text,
    icon,
    link,
}: {
    text?: string;
    icon?: React.ReactNode;
    link?: string;
}): React.ReactElement {
    return (
        <div className="px-3 py-2 flex items-center justify-center font-medium">
            {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                    <span className="text-lg">{icon}</span>
                    {text}
                </a>
            ) : (
                <>
                    <span className="text-lg">{icon}</span>
                    {text}
                </>
            )}
        </div>
    );
}

export default function Banner(): React.ReactElement {

    const shouldDisplayGithub = projectConfigOptions.links?.github?.bannerDisplay;

    return (
        <>
            {/* Holds the global docuflow app banner. Will contain any links given from the settings, such as github and whatnot, and other links.*/}
            <header className="w-full p-2 pr-5 flex flex-row items-center justify-end gap-3 border-b border-slate-200">
                {/* For now, we'll keep a couple place holder boxes here for what it would look like. */}
                <div className="flex flex-row items-center justify-center gap-3">
                    <MockBannerLink />
                    <MockBannerLink />
                    <MockBannerLink />
                </div>
                <div className="border-l border-gray-200">
                    {
                        shouldDisplayGithub ? (
                            <BannerElement icon={<FaGithub />} link={projectConfigOptions.links!.github!.url} />
                        ) : null
                    }
                </div>
            </header>
        </>
    );
}
