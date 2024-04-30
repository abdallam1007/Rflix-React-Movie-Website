import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { Dictionary, Movie, Movies, fetchFilteredMovies, mapMoviesToDictionary } from "./homePageSlice"
import { useState } from "react";
import accessTokenAuth from '../../constants/config';
import './styles/search.css'
import MoviesList from "./moviesList";

const Search = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [query, setQuery] = useState('');
  
    const [searchedMovies, setsearchedMovies] = useState<Dictionary<Movie>>({})
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        dispatch(fetchFilteredMovies({accessTokenAuth, title: value}))
        .then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const payload = response.payload as Movies
                const resultsMapped = mapMoviesToDictionary(payload.results)
                setsearchedMovies(resultsMapped)
            }
        })
    };
  
    return (
        <div className="search-wrapper">
            <div className="search-container">
                <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search by movie title..."
                />
            </div>
            {query.length > 0 && <h2 className="searched-movies-heading">Search Results</h2>}
            <MoviesList movies={searchedMovies} />
        </div>
    );
  };
  
  export default Search;
