import { useParams } from "react-router";
import React, { Suspense, useEffect, useState, Dispatch, SetStateAction ,ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import { compile, run } from "@mdx-js/mdx";

import { type Fragment, type Jsx } from "@mdx-js/mdx";
import * as runtime_ from "react/jsx-runtime";

import { MDXHeading } from "./MainContent";

// @ts-expect-error: the automatic react runtime is untyped.
const runtime: { Fragment: Fragment; jsx: Jsx; jsxs: Jsx } = runtime_;

type HeadingProps = {
  level: number;
  children: React.ReactNode;
};

type ComponentsType = {
  [key: string]: (props: HeadingProps) => JSX.Element;
};

const headingLevels = [1, 2, 3, 4, 5, 6];

function ParseMDX({
  setHeadings,
  setMdxElement,
  filePath,
}: {
  setHeadings: Dispatch<SetStateAction<MDXHeading[]>>;
  setMdxElement: Dispatch<SetStateAction<ReactNode>>;
  filePath: string | undefined;
}): void {
  useEffect(() => {
    (async () => {
      // Fetch the requested file path documentation
      const response = await fetch(`/docs/${filePath}`);
      const mdxText = await response.text();

      // Compile and run it client side
      const compiledMdx = await compile(mdxText, {
        outputFormat: "function-body",
      });
      const { default: Content } = await run(compiledMdx, {
        ...runtime,
        baseUrl: "docs/",
      });

      // We're going to return the MDXElement to be rendered, but we want to keep track of the
      // headings from the document so we can build a table of contents. Thus, we're going to
      // extract all the headings.
      const tempHeadings: MDXHeading[] = [];
      const Heading = ({
        level,
        children,
      }: {
        level: number;
        children: React.ReactNode;
      }) => {
        const text = React.Children.toArray(children).join("");
        const id = text.toLowerCase().replace(/\s/g, "-");

        // Check if the heading already exists in tempHeadings
        if (
          !tempHeadings.some(
            (heading) => heading.id === id && heading.level === level
          )
        ) {
          tempHeadings.push({ id, text, level });
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
      };

      setHeadings(tempHeadings);
      
      const components: ComponentsType = headingLevels.reduce((acc, level) => {
        acc[`h${level}`] = (props) => (
          <Heading {...props} level={level} children={props.children} />
        );

        return acc;
      }, {} as ComponentsType);

      setMdxElement(
        <Content
          components={components}
        />
      );
    })();
  }, [filePath]);
}

export default function DynamicDoc({
  setHeadings,
}: {
  setHeadings: React.Dispatch<React.SetStateAction<MDXHeading[]>>;
}): React.ReactElement {
  const [mdxElement, setMdxElement] = useState<React.ReactNode>(null);

  const { "*": filePath } = useParams<{ "*": string }>();

  ParseMDX({
    setHeadings, setMdxElement, filePath
  });

  return (
    <>
      <div className="w-full ml-10 mt-5 text-slate-800">
        <MDXProvider>
          <Suspense fallback={<div>Loading...</div>}>{mdxElement}</Suspense>
        </MDXProvider>
      </div>
    </>
  );
}
