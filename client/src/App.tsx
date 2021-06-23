import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  const code = (new URLSearchParams(window.location.search)).get('code');

  return (
    <div>
      {code ? <Dashboard code={code}/> : <Login />}
    </div>
  )
}