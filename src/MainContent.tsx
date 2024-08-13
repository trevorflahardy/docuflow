import { useState } from "react";

import Sidebar from "./components/sidebar/Sidebar";
import DynamicDoc from "./DynamicDoc";
import OnThisPage from "./OnThisPage";

/**
 * Holds an interface for the MDX headings. These are injected into the MDX item such that
 * we can build a table of contents.
 */
export interface MDXHeading {
  id: string,
  text: string,
  level: number
};

export default function MainContent() {
    // Create a new state for the headings on the currently rendered MDX document.
    const [headings, setHeadings] = useState<MDXHeading[]>([]);

    return (
        <>
            <div className="flex flex-row place-items-stretch max-w-8xl mx-auto px-4 min-h-screen">
                <Sidebar />
                <DynamicDoc setHeadings={setHeadings} />
                <OnThisPage headings={headings} />
            </div>
        </>
    )
}