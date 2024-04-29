import { useDispatch } from "react-redux";
import { resetState } from "../auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";


const MyRatingsNav = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()


    const handleLogout = () => {
        dispatch(resetState())
        navigate('/login')
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