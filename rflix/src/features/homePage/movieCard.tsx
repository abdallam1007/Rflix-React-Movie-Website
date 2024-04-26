import Genres from './genres'
import { Movie } from './homePageSlice'
import Poster from './poster'
import Rating from './rating'
import './styles/movieCard.css'

interface MovieCardProps {
    movie: Movie
}

const MovieCard = ({movie}: MovieCardProps) => {
    return (
        <div className="movie-card">
            <Poster posterPath={movie.poster_path} title={movie.title} />
            <div className="movie-details">
                <h2 className="movie-title">{movie.title}</h2>
                <p className="release-date">Release Date: {movie.release_date}</p>
                <Genres genreIds={movie.genre_ids} />
                <Rating movie={movie} />
            </div>
        </div>
    );
}

export default MovieCard
