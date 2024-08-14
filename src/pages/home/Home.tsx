import Config from "../../docuflow/config";
import { useConfig } from "../../state";
import projectConfigOptions from '../../docuflow.config';
import Button from "../../components/Button";
import { FaBook, FaGithub } from "react-icons/fa";

function DefaultHome({ config }: { config: Config }): React.ReactElement {
    const description = projectConfigOptions.projectDescription || "This is the default home page for your project. You can customize this by creating a home.mdx file your project and specifying its location in your docuflow config settings.";

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-4xl font-bold text-center mt-20">Welcome to <span className="text-accent-light">Docuflow</span></h1>

                <p className="text-center mt-5 max-w-4xl !m-2">{description}</p>

                {/* Holds the main links. In this case, because the user hasn't added a home.mdx file, we'll go
                only to the documentation and github link (if we can) */}
                <div className="flex flex-row items-center justify-around gap-7">
                    <Button text="Docs" color="primary" icon={<FaBook />} link={`/d/${config.defaultPath}`} reactLink={true} />
                    {
                        projectConfigOptions.links?.github ? (
                            <Button text="Github" color="secondary" icon={<FaGithub />} link={projectConfigOptions.links.github.url} />
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}

function CustomHome({config}: {config: Config}): React.ReactElement {
    // TODO: Custom parsing of this home file

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

    return projectConfigOptions.home ? <CustomHome config={config} /> : <DefaultHome config={config} /> 
}