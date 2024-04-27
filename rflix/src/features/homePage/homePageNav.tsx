import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { resetState } from "../auth/authSlice";

const HomePageNav = () => {
    const dispatch = useDispatch<AppDispatch>()


    const handleLogout = () => {
        dispatch(resetState())
    }


    return (
      <nav>
        <ul>
            <li>
                <Link to="/myratings">My Ratings</Link>
            </li>
            <li>
                <button onClick={handleLogout}>Logout</button>
            </li>
        </ul>
      </nav>
    );
  };
  
  export default HomePageNav;