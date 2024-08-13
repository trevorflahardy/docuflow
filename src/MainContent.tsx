import Sidebar from "./components/sidebar/Sidebar";
import DynamicDoc from "./DynamicDoc";

export default function Hero() {
    return (
        <>
            <div className="flex flex-row place-items-stretch max-w-8xl mx-auto px-4 min-h-screen">
                <Sidebar />
                <DynamicDoc />
            </div>
        </>
    )
}