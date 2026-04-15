import { useRouter } from "next/navigation";
export default function Home() {
    const router = useRouter();
    return (
        <div>
            <p onClick={() => router.push("/student")}>Home</p>
        </div>
    );
}