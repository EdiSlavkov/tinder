import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import { Matches, Explore } from "./components/SuggestionsDashboard/SuggestionsDashboard";
import React, { useState, useEffect } from "react";
import Loader from "./components/Loader/Loader";
import CarouselComments from "./components/Carousel/Carousel";
import ProfilePage from "./components/ProfilePage/ProfilePage";


function App() {
  const [loader, setLoader] = useState(false);

	useEffect(()=>{
		setTimeout(() => {
			setLoader(true)
		}, 1000);
	},[loader])

	return (
			loader ? <Routes>
			<Route path="/" element={<><LandingPage></LandingPage><CarouselComments/></>}></Route>
			<Route path='/app' element={<Outlet></Outlet>}>
				<Route index element={<Navigate to='recs'></Navigate>}></Route>
				<Route path='recs' element= {<Matches></Matches>}></Route>
				<Route path='explore' element= { <Explore></Explore>}></Route>
				<Route path='profile' element= {<ProfilePage></ProfilePage>}></Route>
			</Route>
		</Routes> : <Loader/>
			
	);
}

export default App;
