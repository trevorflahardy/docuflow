import React from "react";

export interface MDXHeading {
  id: string;
  text: string;
  level: number;
}

type HeadingProps = {
  level: number;
  children: React.ReactNode;
};

type ComponentsType = {
  [key: string]: (props: HeadingProps) => JSX.Element;
};

const headingLevels = [1, 2, 3, 4, 5, 6];


function Heading({
  level,
  children,
  headings,
}: {
  level: number;
  children: React.ReactNode;
  headings: MDXHeading[];
}) {
  const text = React.Children.toArray(children).join("");
  const id = text.toLowerCase().replace(/\s/g, "-");

  // Check if the heading already exists in tempHeadings
  if (
    !headings.some((heading) => heading.id === id && heading.level === level)
  ) {
    headings.push({ id, text, level });
  }

  return React.createElement(
    `h${level}`,
    { id, className: "group" },
    <>
      {children}
      <a
        href={`#${id}`}
        className="invisible group-hover:visible text-gray-700 hover:text-gray-900 text-sm"
      >
        #
      </a>
    </>
  );
}

export interface ParseMDXWithHeadersResult {
    mdx: React.ReactNode;
    headings: MDXHeading[];
}

export async function parseMDXWithHeaders(filePath: string): Promise<ParseMDXWithHeadersResult> {
  // Parse the MDX file. Vite cannot optimize dynamic imports and throws a warning, so we need to
  // ignore the warning as the importing is easiest to evaluate MDX files on the fly.
  const { default: Content } = await import(`docs/${filePath}`); /* @vite-ignore */

  const headings: MDXHeading[] = [];
  const components: ComponentsType = headingLevels.reduce((acc, level) => {
    acc[`h${level}`] = (props) => (
      <Heading
        {...props}
        level={level}
        children={props.children}
        headings={headings}
      />
    );

    return acc;
  }, {} as ComponentsType);

  return {
    mdx: <Content components={components} />,
    headings,
  };
}
