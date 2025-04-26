import logo from './logo.svg';
import './App.css';
import DraftDisplay from "./components/DraftDisplay";
import GolfersTable from "./components/GolfersTable";

function App() {
    return (
        <div>
            <h1>WVU Alumni Golf</h1>            
			<GolfersTable />
			<DraftDisplay />
        </div>
    );
}

export default App;

