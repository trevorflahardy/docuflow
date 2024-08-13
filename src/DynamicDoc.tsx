import { useParams } from "react-router";
import React, { Suspense, useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { compile, run } from "@mdx-js/mdx";

import { type Fragment, type Jsx } from "@mdx-js/mdx";
import * as runtime_ from "react/jsx-runtime";

import { MDXHeading } from "./MainContent";

// @ts-expect-error: the automatic react runtime is untyped.
const runtime: { Fragment: Fragment; jsx: Jsx; jsxs: Jsx } = runtime_;

export default function DynamicDoc({
  setHeadings,
}: {
  setHeadings: React.Dispatch<React.SetStateAction<MDXHeading[]>>;
}): React.ReactElement {
  const [mdxElement, setMdxElement] = useState<React.ReactNode>(null);

  const { "*": filePath } = useParams<{ "*": string }>();

  useEffect(() => {
    (async () => {
      // Fetch the requested file path documentation
      console.log(filePath);
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
        if (!tempHeadings.some((heading) => heading.id === id && heading.level === level)) {
          tempHeadings.push({ id, text, level });
        }
  
        return React.createElement(`h${level}`, { id }, children);
      };

      setHeadings(tempHeadings);
      setMdxElement(
        <Content
          components={{
            h1: (props) => <Heading level={1} children={props.children} />,
            h2: (props) => (
              <Heading {...props} level={2} children={props.children} />
            ),
            h3: (props) => (
              <Heading {...props} level={3} children={props.children} />
            ),
            h4: (props) => (
              <Heading {...props} level={4} children={props.children} />
            ),
            h5: (props) => (
              <Heading {...props} level={5} children={props.children} />
            ),
            h6: (props) => (
              <Heading {...props} level={6} children={props.children} />
            ),
          }}
        />
      );
    })();
  }, [filePath]);

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
