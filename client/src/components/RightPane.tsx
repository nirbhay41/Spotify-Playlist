import React, { useContext } from 'react';
import '../styles/RightPane.scss';
import { Context } from './Dashboard';
import { MinusCircleIcon, DocumentDownloadIcon, FolderOpenIcon } from '@heroicons/react/outline'
import { saveAs } from 'file-saver';

export default function RightPane() {
    const { playlist, render, setRender,setPlaylist } = useContext(Context);

    const drop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('item'));

        const idx = playlist.findIndex((item) => {
            return item.name === data.name;
        });

        if (idx === -1) {
            playlist.push(data);
            setRender(!render);
        }
    }

    const dragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const download = () => {
        const filename = 'my-playlist.json';
        const fileToSave = new Blob([JSON.stringify(playlist)], {
            type: 'application/json'
        });

        saveAs(fileToSave, filename);
    }

    const openFile = () => {
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type','file');
        fileSelector.setAttribute('accept','.json')
        fileSelector.onchange = async (e: any) => {
            const file: File = e.target.files.item(0);
            const newUserPlaylist:Item[] = JSON.parse(await file.text());
            setPlaylist(newUserPlaylist);
        }
        fileSelector.click();
    }

    return (
        <div className="rightpane" onDragOver={e => dragOver(e)} onDrop={e => drop(e)}>
            <header>
                <p>Users Locally Saved Playlists</p>
                <FolderOpenIcon height={30} cursor="pointer" onClick={openFile} />
                <DocumentDownloadIcon height={30} cursor="pointer" onClick={download} />
            </header>
            <main>
                <ul className="userPlaylist">
                    {playlist.map(e => (
                        <MenuItem key={e.id} playlist={e} />
                    ))}
                </ul>
            </main>
        </div>
    )
}

function MenuItem({ playlist }: { playlist: Item }) {
    const { playlist: userPlaylist, setPlaylist } = useContext(Context);
    const removePlaylist = () => {
        const idx = userPlaylist.findIndex((e) => {
            return e.name === playlist.name;
        });

        const firstHalf = userPlaylist.slice(0, idx);
        const secondHalf = userPlaylist.slice(idx + 1);
        setPlaylist([...firstHalf, ...secondHalf]);
    }
    return (
        <div className="playlist">
            <li>{playlist.name}</li>
            <MinusCircleIcon height={20} cursor="pointer" onClick={removePlaylist} />
        </div>
    );
}
