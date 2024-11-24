import {React,useState} from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Delivery from "../imgs/delivery.png";
import Popular from "./Category/Popular";
import Navbar from './Navbar'

function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  document.title = "Amazon"

  const handleScroll = () => {
    window.scrollTo({
      top: scrollPosition + 750, 
      behavior: "smooth" 
    });
    setScrollPosition(scrollPosition + 750);
    setTimeout(() => {
    setScrollPosition(0); 
      
    }, 100); 
  };

  return (
    <>
    <Navbar/>
        <div className="content">
          <div className="poster-area">
            <div className="poster-data">
              <p className="poster-head">Free Delivery!</p>
              <p className="poster-desc">
                Don't miss it out! Only today, get free{" "}
                <b style={{ fontSize: "22px" }}>Next Day</b> delivery on all
                your orders.
              </p>
            </div>
            <div className="button-container">
              <button onClick={handleScroll} className="browse-btn">Browse products</button>
              <button onClick={() => navigate('/categories')} className="browse-btn">Shop by Categories</button>
            </div>
          </div>
          <img src={Delivery} className="delivery" />
          <Popular />
        </div>
    </>
  );
}

export default Home;
