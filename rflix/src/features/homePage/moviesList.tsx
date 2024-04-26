import { Movie, Dictionary } from "./homePageSlice"
import MovieCard from "./movieCard"
import './styles/movieList.css'

interface MovieListProps {
    movies: Dictionary<Movie>
}

const MoviesList = ({ movies }: MovieListProps) => {
    return (
        <div className="movies-container">
            {Object.values(movies).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
}

export default MoviesList;
