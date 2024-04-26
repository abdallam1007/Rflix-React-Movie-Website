import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { Movie, fetchPopularMovies, selectPopularMovies } from "./homePageSlice"
import { selectAccessTokenAuth } from "../auth/authSlice"
import { useEffect, useState } from "react"
import MoviesList from "./moviesList"
import './styles/popularMovies.css'


const PopularMovies = () => {
    const dispatch = useDispatch<AppDispatch>()

    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const popularMovies = useSelector(selectPopularMovies)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchPopularMovies({accessTokenAuth, pageNumber: currentPage}));
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h2 className="popular-movies-heading">Popular Movies</h2>
            <MoviesList movies={popularMovies} />
            <div className="pagination-buttons">
                <button onClick={() => handlePageChange(1)}>Page 1</button>
                <button onClick={() => handlePageChange(2)}>Page 2</button>
            </div>
        </div>
    );
};

export default PopularMovies
