import projectConfigOptions from "../../docuflow.config";
import { FaGithub } from "react-icons/fa";
import { useConfig } from "../../state";
import { Link } from "react-router-dom";
import Config from "../../docuflow/config";
import { LinkSettings } from "../../docuflow/interfaces";

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
    <div className="px-3 py-2 flex items-center justify-center">
      {link ? (
        <Link to={link}>
          <span className="text-lg">{icon}</span>
          {text}
        </Link>
      ) : (
        <>
          <span className="text-lg">{icon}</span>
          {text}
        </>
      )}
    </div>
  );
}

const CUSTOM_LINKS = ["github"];

function findCustomBannerLinks(config: Config | null): LinkSettings[] {
  if (!config) {
    return [];
  }

  const customBannerLinks: LinkSettings[] = [];

  // Walk through all the key, value pairs in the links. If the key is
  // has a bannerDisplay property and is not a custom link type, we'll add it to the
  // custom banner links.
  for (const key in projectConfigOptions.links) {
    const link = projectConfigOptions.links[key];
    // If the link is a string, we can continue
    if (typeof link === "string") {
      continue;
    }

    if (CUSTOM_LINKS.includes(key)) {
      continue;
    }

    // If not, only append if the link has a URL and a bannerDisplay property that
    // evals to truthy
    if (link.url && link.bannerDisplay) {
      customBannerLinks.push(link);
    }
  }

  return customBannerLinks;
}
export default function Banner(): React.ReactElement {
  const { config } = useConfig();
  const shouldDisplayGithub = projectConfigOptions.links?.github?.bannerDisplay;

  const customBannerLinks: LinkSettings[] = findCustomBannerLinks(config);

  return (
    <>
      {/* Holds the global docuflow app banner. Will contain any links given from the settings, such as github and whatnot, and other links.*/}
      <header className="w-full p-2 px-5 flex flex-row items-center justify-between gap-3 border-b border-slate-200 font-medium">
        {/* The logo of the project to go home OR the project's name if no logo
                has been provided. Shows at the right side*/}
        <div className="">
            <Link to="/">
                Docuflow
            </Link>
        </div>

        {/* The docs and custom links on the banner. Shows at the left side */}
        <div className="flex flex-row items-center justify-center gap-3">
          {config && (
            <BannerElement text="Docs" link={`/d/${config.defaultPath}`} />
          )}

          {customBannerLinks.map((link) => (
            <BannerElement key={link.url} text={link.name} link={link.url} />
          ))}
                  
          <div className="border-l border-gray-200">
            {/* After the links we may have a github link */}
            {shouldDisplayGithub ? (
              <BannerElement
                icon={<FaGithub />}
                link={projectConfigOptions.links!.github!.url}
              />
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}
