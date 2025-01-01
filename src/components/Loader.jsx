import { Html, useProgress } from "@react-three/drei"

export const Loader = () =>
{
    const { progress } = useProgress()
    return <Html center >
        <p className="flex" >{progress}% loading</p>
    </Html>
}
