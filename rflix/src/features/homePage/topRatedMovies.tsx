import { useEffect, useState } from "react";
import { Dictionary, Movie, Movies, fetchMovies, mapMoviesToDictionary, selectgenres } from "./homePageSlice";
import accessTokenAuth from '../../constants/config';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import MoviesList from "./moviesList";
import './styles/topRatedMovies.css'

const TopRatedMovies = () => {
    const dispatch = useDispatch<AppDispatch>()

    const genres = useSelector(selectgenres)

    const [topRatedMovies, settopRatedMovies] = useState<Dictionary<Movie>>({})
    const [currentPage, setCurrentPage] = useState(1);
    const [currentGenre, setCurrentGenre] = useState(0)
    const [selectedMovies, setSelectedMovies] = useState(topRatedMovies);

    const TOP_RATED_MOVIES_URL = 'https://api.themoviedb.org/3/movie/top_rated'

    useEffect(() => {
        dispatch(fetchMovies({accessTokenAuth, pageNumber: currentPage, moviesURL: TOP_RATED_MOVIES_URL}))
        .then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const payload = response.payload as Movies
                const resultsMapped = mapMoviesToDictionary(payload.results)
                settopRatedMovies(resultsMapped)
            }
        })
    }, [currentPage])

    useEffect(() => {
        if (currentGenre === 0) {
            setSelectedMovies(topRatedMovies)
        } else {
            const filteredMovies: Dictionary<Movie> = {};
            Object.keys(topRatedMovies).forEach(key => {
                const movie = topRatedMovies[Number(key)];
                if (movie.genre_ids.includes(currentGenre)) {
                    filteredMovies[movie.id] = movie;
                }
            });
            setSelectedMovies(filteredMovies);
        }
    }, [currentGenre, topRatedMovies]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleGenreChange = (event: { target: { value: string } }) => {
        setCurrentGenre(Number(event.target.value))
    }

    return (
        <div>
            <div className="header-with-select">
                <h2 className="top-rated-movies-heading">Top Rated Movies</h2>
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

export default TopRatedMovies