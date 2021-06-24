import '../styles/Login.scss'
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=4ec27037f1434334b3b335e4271b2f2f&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-email%20user-read-private%20user-library-read%20user-library-modify";

export default function Login() {
    return (
        <div className="login">
            <a className="login-btn" href={AUTH_URL}>Login With Spotify</a>
        </div>
    )
}
