import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Nav from "./components/shared/Nav"
import Page from "./components/shared/Page";

function App() {
    return (
        <BrowserRouter>
            <div className="body-container">
                <div className="background ctr-x">
                    <Nav />
                    <Routes>
                        <Route path={"/"} element={<Page type={"home"} />} />
                        <Route path={"/view/"} element={<Page type={"view"} />} />
                        <Route path={"/year/"} element={<Page type={"year"} />} />
                        <Route path={"/competitor/"} element={<Page type={"competitor"} />} />
                        <Route path={"/score/"} element={<Page type={"score"} />} />
                        <Route path={"/report/"} element={<Page type={"report"} />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
