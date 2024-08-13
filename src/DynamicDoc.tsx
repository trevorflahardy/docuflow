import { useParams } from 'react-router';
import { findModule, findFileInModule } from './docuflow/utils';
import { useEffect, useState } from 'react';
import { ModuleConfig } from './docuflow/config';


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
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState(null as ModuleConfig | null);
    const [file, setFile] = useState(null as string | null);

    const { '*': docPath } = useParams<{ '*': string }>();

    useEffect(() => {
        (async () => {
            const path = parseDocPath(docPath);
            const module = await findModule(path);
            setModule(module);
            
            if (module) {
                const file = findFileInModule(path.pop()!, module);
                setFile(file);
            }

            setLoading(false);

        })()
    }, []);

    const path = parseDocPath(docPath);
    return (
        <>
            <div className='basis-4/5 ml-10 mt-5'>
                <h1>
                    Looking at docs for {path} {loading ? '...' : ''} {module ? 'Module found!' : ''} {file ? 'File found!' : ''}
                </h1>
            </div>
        </>
    )
}