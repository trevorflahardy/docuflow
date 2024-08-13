import { useParams } from 'react-router';


/**
 * Parses a document path into an array of strings. This is so that module
 * finding can be done more easily.
 * 
 * @param docPath The path to parse an an array.
 * @returns An array of strings that represent the path.
 */
function parseDocPath(docPath?: string): string[] {
    return (docPath || '').split('/');
}   

export default function DynamicDoc(): React.ReactElement {
    const { '*': docPath } = useParams<{ '*': string }>();

    return (
        <>
            <div className='basis-4/5 ml-10 mt-5'>
                <h1>
                    Looking at docs for {docPath}
                </h1>
            </div>
        </>
    )
}