import { MDXHeading } from "./Docs";

export default function OnThisPage({ headings }: { headings: MDXHeading[] }): React.ReactElement {
    return (
        <>
            <div className="min-w-52 m-5">
                <p className="font-semibold text-black">
                    On this Page
                </p>

                <div>
                    {headings.map((heading, index) => (
                        <div
                            key={index}
                            className={`text-sm text-gray-700 hover:text-gray-900 ${
                                heading.level === 1 ? "ml-0" : heading.level === 2 ? "ml-2" : "ml-4"
                            }`}
                        >
                            <a href={`#${heading.id}`}>
                                {heading.text}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}