import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { Dictionary, Movie, fetchPopularMovies, selectPopularMovies, selectgenres } from "./homePageSlice"
import accessTokenAuth from '../../constants/config';
import { useEffect, useState } from "react"
import MoviesList from "./moviesList"
import './styles/popularMovies.css'


const PopularMovies = () => {
    const dispatch = useDispatch<AppDispatch>()

    const popularMovies = useSelector(selectPopularMovies)
    const genres = useSelector(selectgenres)

    const [currentPage, setCurrentPage] = useState(1);
    const [currentGenre, setCurrentGenre] = useState(0)
    const [selectedMovies, setSelectedMovies] = useState(popularMovies);

    useEffect(() => {
        dispatch(fetchPopularMovies({accessTokenAuth, pageNumber: currentPage}));
    }, [currentPage]);

    useEffect(() => {
        if (currentGenre === 0) {
            setSelectedMovies(popularMovies)
        } else {
            const filteredMovies: Dictionary<Movie> = {};
            Object.keys(popularMovies).forEach(key => {
                const movie = popularMovies[Number(key)];
                if (movie.genre_ids.includes(currentGenre)) {
                    filteredMovies[movie.id] = movie;
                }
            });
            setSelectedMovies(filteredMovies);
        }
    }, [currentGenre, popularMovies]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleGenreChange = (event: { target: { value: string } }) => {
        setCurrentGenre(Number(event.target.value))
    }

    return (
        <div>
            <div className="header-with-select">
                <h2 className="popular-movies-heading">Popular Movies</h2>
                <select className="genre-select" onChange={handleGenreChange}>
                    <option value="">Select a Genre</option>
                    {Object.entries(genres).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </div>
            <MoviesList movies={selectedMovies} />
            <div className="pagination-buttons">
                <button 
                    className={currentPage === 1 ? 'active' : ''} 
                    onClick={() => handlePageChange(1)}
                >
                    Page 1
                </button>
                <button 
                    className={currentPage === 2 ? 'active' : ''} 
                    onClick={() => handlePageChange(2)}
                >
                    Page 2
                </button>
            </div>
        </div>
    );
};

export default PopularMovies
