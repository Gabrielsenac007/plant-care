import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { Plants } from "./pages/Plants"
import { Categories } from "./pages/Categories"
import { Introduction } from "./pages/Introduction"
import { Center } from "./pages/Center"



export const AppRoutes = () => {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Introduction />} />
                <Route path="/center" element={<Center />}>
                <Route index element={<Dashboard />} />
                <Route path="plants" element={<Plants />} />
                <Route path="categories" element={<Categories />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
