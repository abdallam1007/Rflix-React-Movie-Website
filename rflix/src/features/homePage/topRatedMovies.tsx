import { useEffect, useState } from "react";
import { fetchTopRatedMovies, selectTopRatedMovies } from "./homePageSlice";
import { selectAccessTokenAuth } from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import MoviesList from "./moviesList";
import './styles/topRatedMovies.css'

const TopRatedMovies = () => {
    const dispatch = useDispatch<AppDispatch>()

    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const topRatedMovies = useSelector(selectTopRatedMovies)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchTopRatedMovies({accessTokenAuth, pageNumber: currentPage}));
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h2 className="top-rated-movies-heading">Top Rated Movies</h2>
            <MoviesList movies={topRatedMovies} />
            <div className="pagination-buttons">
                <button onClick={() => handlePageChange(1)}>Page 1</button>
                <button onClick={() => handlePageChange(2)}>Page 2</button>
            </div>
        </div>
    );
};

export default TopRatedMovies