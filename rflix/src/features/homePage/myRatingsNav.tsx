import { useDispatch } from "react-redux";
import { resetState } from "../auth/authSlice";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../app/store";


const MyRatingsNav = () => {
    const dispatch = useDispatch<AppDispatch>()


    const handleLogout = () => {
        dispatch(resetState())
    }


    return (
      <nav>
        <ul>
            <li>
                <Link to="/">Homepage</Link>
            </li>
            <li>
                <button onClick={handleLogout}>Logout</button>
            </li>
        </ul>
      </nav>
    );
  };
  
  export default MyRatingsNav;