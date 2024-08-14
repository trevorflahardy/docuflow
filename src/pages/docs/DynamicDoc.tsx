import { useParams } from "react-router";
import React, {
  Suspense,
  useEffect,
  useState,
} from "react";
import { MDXProvider } from "@mdx-js/react";

import { MDXHeading } from "./Docs";
import { parseMDXWithHeaders } from "../../parsing";

export default function DynamicDoc({
  setHeadings,
}: {
  setHeadings: React.Dispatch<React.SetStateAction<MDXHeading[]>>;
}): React.ReactElement {
  const [MDXElement, setMDXElement] = useState<React.ReactNode | null>(null);
  const { "*": filePath } = useParams<{ "*": string }>();

  useEffect(() => {
    (async () => {
      if (!filePath) {
        return;
      }

      const result = await parseMDXWithHeaders(filePath);
      setMDXElement(result.mdx);
      setHeadings(result.headings);
    })();
  }, [filePath]);

  return (
    <>
      <div className="w-full ml-10 mt-5 text-slate-800">
        <MDXProvider>
          <Suspense fallback={<div>Loading...</div>}>{MDXElement}</Suspense>
        </MDXProvider>
      </div>
    </>
  );
}
