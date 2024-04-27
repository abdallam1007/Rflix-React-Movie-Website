import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { fetchFilteredMovies, selectFilteredMovies } from "./homePageSlice"
import { useState } from "react";
import { selectAccessTokenAuth } from "../auth/authSlice";
import './styles/search.css'
import MoviesList from "./moviesList";

const Search = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
  
    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const searchedMovies = useSelector(selectFilteredMovies);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        dispatch(fetchFilteredMovies({accessTokenAuth, title: value}));
        handleSuggestions();
        setShowResults(false);
    };
  
    const handleSuggestions = () => {
        const titles = Object.values(searchedMovies).map(movie => movie.title);
        setSuggestions(titles);
    };
  
    const handleSearch = () => {
        dispatch(fetchFilteredMovies({accessTokenAuth, title: query}));
        setSuggestions([]);
        setShowResults(true);
    };
  
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        dispatch(fetchFilteredMovies({accessTokenAuth, title: suggestion}));
        handleSuggestions()
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
            <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                </li>
                ))}
            </ul>
            <h2 className="searched-movies-heading">Search Results</h2>
            {showResults && <MoviesList movies={searchedMovies} />}
        </div>
    );
  };
  
  export default Search;
