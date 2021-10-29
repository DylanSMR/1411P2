// pages/index.js
import { NextPage } from 'next';
import Loader from "react-loader-spinner";

const Loading: NextPage = () => {
    return (
        <div style={{ width: "100%", height: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center", backgroundColor: "#121212" }}>
            <Loader
                type="ThreeDots"
                color="#00BFFF"
                height={100}      
                width={100}
            />
        </div>
    )
}
export default Loading;