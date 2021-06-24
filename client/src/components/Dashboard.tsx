import useAuth from "../utils/useAuth";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import '../styles/Dashboard.scss';
import { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MenuIcon } from "@heroicons/react/outline";

type ContextType = {
    playlist: Item[],
    setPlaylist: Dispatch<SetStateAction<Item[]>>,
    render: boolean,
    setRender: Dispatch<SetStateAction<boolean>>
}
export const Context = createContext<ContextType>(null);

export default function Dashboard({ code }: { code: string }) {
    const accessToken = useAuth(code);
    const [userPlaylist, setUserPlaylist] = useState<Item[]>([]);
    const [render, setRender] = useState(false);
    const [isOpen,setIsOpen] = useState(false);

    const contextValue: ContextType = {
        playlist: userPlaylist,
        setPlaylist: setUserPlaylist,
        render,
        setRender
    }
    const leftPaneRef = useRef<HTMLDivElement>();
    const rightPaneRef = useRef<HTMLDivElement>();
    const menuRef = useRef<HTMLDivElement>();

    const closeLeftPane = () => {
        leftPaneRef.current.style.width = "0";
        leftPaneRef.current.style.padding = "0";
        rightPaneRef.current.style.width = "100%";
        menuRef.current.style.display = "block";
    }

    const openLeftPane = () => {
        leftPaneRef.current.style.width = "50%";
        leftPaneRef.current.style.padding = "2rem";
        rightPaneRef.current.style.width = "50%";
        menuRef.current.style.display = "none";
    }

    const menuHandler = () => {
        if(isOpen){
            leftPaneRef.current.style.width = "100%";
            leftPaneRef.current.style.padding = "2rem";
            rightPaneRef.current.style.width = "0";
        }else{
            leftPaneRef.current.style.width = "0";
            leftPaneRef.current.style.padding = "0";
            rightPaneRef.current.style.width = "100%";
        }
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth < 800) {
            closeLeftPane();
        } else if (window.innerWidth >= 800) {
            openLeftPane();
        }
    })

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userPlaylist'));
        if (data)
            setUserPlaylist(data);
    }, [])

    useEffect(() => {
        localStorage.setItem('userPlaylist', JSON.stringify(userPlaylist));
    });

    return (
        <div className="dashboard">
            <header className="header">
                <div className="logo">
                    <img src="/Spotify-Logo.webp" />
                    <span>Playlist</span>
                </div>

                <div ref={menuRef} className="menu" style={window.innerWidth < 800 ? { display: "block" } : { display: "none" }} onClick={() => {
                    setIsOpen(!isOpen);
                    menuHandler()
                }}>
                    <MenuIcon height={40} color="white" />;
                </div>
            </header>
            <main>
                <Context.Provider value={contextValue}>
                    <LeftPane accessToken={accessToken} leftPaneRef={leftPaneRef} />
                    <div className="rightPaneDiv" ref={rightPaneRef}>
                        <RightPane />
                    </div>
                </Context.Provider>
            </main>
        </div>
    )
}
