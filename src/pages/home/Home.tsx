import Config from "../../docuflow/config";
import { useConfig } from "../../state";
import Button from "../../components/Button";
import { FaBook, FaGithub } from "react-icons/fa";

function DefaultHome({ config }: { config: Config }): React.ReactElement {
    const description = config.projectDescription || "This is the default home page for your project. You can customize this by creating a home.mdx file your project and specifying its location in your docuflow config settings.";

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-5">
                <h1 className="text-4xl font-bold text-center !mt-20 !mb-0">Welcome to <span className="text-accent-light">{config.projectName}</span></h1>

                <p className="text-center mt-5 max-w-4xl !m-0">{description}</p>

                {/* Holds the main links. In this case, because the user hasn't added a home.mdx file, we'll go
                only to the documentation and github link (if we can) */}
                <div className="flex flex-row items-center justify-around gap-7">
                    <Button text="Docs" color="primary" icon={<FaBook />} link={`/d/${config.defaultPath}`} />
                    {
                        config.links?.github ? (
                            <Button text="Github" color="secondary" icon={<FaGithub />} link={config.links.github.url} />
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}

function CustomHome({config}: {config: Config}): React.ReactElement {
    // Safety: CustomHome is only ever called if config.home is known to be
    // something, so we can safely assume it's a string here.
    // We're going to parse the home MDX file given to use and display it here.

    const homeMDXFile = config.home;

    return (
        <>
            <div>
            </div>
        </>
    )
}

/**
 * The Home page for the docuflow project. This is completely customizable via a MDX file passed to the options.
 * The assumption here is if the user does not provide a home page, a default one will be created for them
 * using the project name.
 */
export default function Home() {
    const { config } = useConfig();

    if (!config) {
        // TODO: Some sort of loading state?
        return (
            <>
                <div>
                    Loading...
                </div>
            </>
        )
    }

    return config.home ? <CustomHome config={config} /> : <DefaultHome config={config} /> 
}