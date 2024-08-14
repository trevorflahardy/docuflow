import { compile, run } from "@mdx-js/mdx";

import { type Fragment, type Jsx } from "@mdx-js/mdx";
import React from "react";
import * as runtime_ from "react/jsx-runtime";

// @ts-expect-error: the automatic react runtime is untyped.
const runtime: { Fragment: Fragment; jsx: Jsx; jsxs: Jsx } = runtime_;

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

/**
 * Takes a file path and parses the MDX file at that path into a
 * MDXComponent.
 *
 * @param filePath The file path to parse.
 * @returns The parsed MDX file.
 */
export async function parseMDX(filePath: string) {
  // Fetch the requested file path documentation
  const response = await fetch(`/docs/${filePath}`);
  const mdxText = await response.text();

  // Compile and run it client side
  const compiledMdx = await compile(mdxText, {
    outputFormat: "function-body",
  });
  const result = await run(compiledMdx, {
    ...runtime,
    baseUrl: "docs/",
  });

  return result;
}

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
  // Parse the MDX file
  const { default: Content } = await parseMDX(filePath);

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
