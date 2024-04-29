import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { fetchFilteredMovies, selectFilteredMovies } from "./homePageSlice"
import { useState } from "react";
import accessTokenAuth from '../../constants/config';
import './styles/search.css'
import MoviesList from "./moviesList";

const Search = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [query, setQuery] = useState('');
  
    const searchedMovies = useSelector(selectFilteredMovies);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        dispatch(fetchFilteredMovies({accessTokenAuth, title: value}));
    };
  
    const handleSearch = () => {
        dispatch(fetchFilteredMovies({accessTokenAuth, title: query}));
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
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
            {query.length > 0 && <h2 className="searched-movies-heading">Search Results</h2>}
            <MoviesList movies={searchedMovies} />
        </div>
    );
  };
  
  export default Search;
