import { Html, useProgress } from "@react-three/drei"

export const Loader = () =>
{
    const { progress } = useProgress()
    return <Html center >
       <p className="flex" >{progress.toPrecision(4)}% loading</p>
       </Html>
}
   