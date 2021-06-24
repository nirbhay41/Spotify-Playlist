import useAuth from "../utils/useAuth";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import '../styles/Dashboard.scss';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

type ContextType = {
    playlist: Item[],
    setPlaylist: Dispatch<SetStateAction<Item[]>>,
    render: boolean,
    setRender: Dispatch<SetStateAction<boolean>>
}
export const Context = createContext<ContextType>(null);

export default function Dashboard({ code }: { code: string }) {
    const accessToken = useAuth(code);
    const [userPlaylist,setUserPlaylist] = useState<Item[]>([]);
    const [render, setRender] = useState(false);
    const contextValue:ContextType = {
        playlist: userPlaylist,
        setPlaylist: setUserPlaylist,
        render,
        setRender
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userPlaylist'));
        if(data)
            setUserPlaylist(data);
    },[])

    useEffect(() => {
        localStorage.setItem('userPlaylist',JSON.stringify(userPlaylist));
    });

    return (
        <div className="dashboard">
            <header className="header">
                <img src="/Spotify-Logo.webp"/>
                <span>Playlist</span>
            </header>
            <main>
                <Context.Provider value={contextValue}>
                    <LeftPane accessToken={accessToken} />
                    <RightPane />
                </Context.Provider>
            </main>
        </div>
    )
}
