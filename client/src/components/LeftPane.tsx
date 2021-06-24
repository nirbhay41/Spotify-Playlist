import '../styles/LeftPane.scss';
import SpotifyWebApi from 'spotify-web-api-node';
import { useContext, useEffect, useState } from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { Context } from './Dashboard';

const spotify = new SpotifyWebApi({
    clientId: '4ec27037f1434334b3b335e4271b2f2f'
});

type LeftPaneProps = { 
    accessToken: string;
    leftPaneRef: React.MutableRefObject<HTMLDivElement>;
}

export default function LeftPane({ accessToken,leftPaneRef }: LeftPaneProps) {
    const [playlist, setPlaylist] = useState<Item[]>([]);

    useEffect(() => {
        if (accessToken)
            spotify.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (accessToken)
            spotify.getFeaturedPlaylists()
                .then(data => {
                    setPlaylist(data.body.playlists.items);
                })
                .catch(err => {
                    console.log(err);
                });
    }, [accessToken])


    return (
        <div className="leftpane" ref={leftPaneRef}>
            <p>Featured Playlists</p>
            {playlist.length > 0 && <ul className="featuredlist">
                {
                    playlist.map(item => (
                        <MenuItem key={item.id} item={item} />
                    ))
                }
            </ul>}
        </div>
    )
}

function MenuItem({ item }: { item: Item }) {
    const [liked, setLiked] = useState(false);
    const { playlist, setPlaylist, render, setRender } = useContext(Context);
    const dragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
        e.dataTransfer.setData('item', JSON.stringify(item));
    }

    const clickHandler = () => {
        setLiked((prev) => {
            return !prev;
        });
        console.log(liked);
        if (!liked) {
            playlist.push(item);
            setRender(!render);
        } else {
            const idx = playlist.findIndex((e) => {
                return e.name === item.name;
            });

            const firstHalf = playlist.slice(0, idx);
            const secondHalf = playlist.slice(idx + 1);
            setPlaylist([...firstHalf, ...secondHalf]);
        }
    }
    return (
        <li className="playlist">
            <div draggable
                onDragStart={(e) => dragStart(e, item)}
            >{item.name}</div>

            {liked ?
                <HeartIconSolid height={20} cursor='pointer' onClick={clickHandler} />
                : <HeartIconOutline height={20} cursor='pointer' onClick={clickHandler} />
            }
        </li>
    )
}
