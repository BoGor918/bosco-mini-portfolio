// mantine
import { Loader } from '@mantine/core';

export default function MainLoading() {
    return (
        <div>
            <div className={`flex justify-center items-center h-screen ` + (localStorage.getItem("theme") === "light" ? "bg-white" : "bg-[#0B1A33]")}>
                <Loader size="lg" />
            </div>
        </div>
    )
}
