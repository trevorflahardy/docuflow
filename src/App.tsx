import Banner from "./components/banner/Banner"

export default function App({content}: {content: React.ReactElement<any>}): React.ReactElement {
    return (
        <>
            <div className="antialiased text-slate-700 bg-white">
                <Banner />
                {content}
            </div>
        </>
    )
}