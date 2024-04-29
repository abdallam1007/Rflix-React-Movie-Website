import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchMovieDetails, fetchMovieRecommendations, fetchMovieReviews, selectMovieDetails, selectMovieRecommendations, selectMovieReviews } from "./detailedPageSlice";
import accessTokenAuth from '../../constants/config';
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Poster from "../homePage/poster";
import Rating from "../homePage/rating";
import MoviesList from "../homePage/moviesList";
import './styles/detailedPage.css'
import DetailedPageNav from "./detailedPageNav";
import { AuthStatus, selectStatus } from "../auth/authSlice";

const DetailedPage = () => {
    const { id } = useParams<{id: string}>()

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    
    const movieDetails = useSelector(selectMovieDetails)
    const movieReviews = useSelector(selectMovieReviews)
    const movieRecommendations = useSelector(selectMovieRecommendations)


    const status = useSelector(selectStatus)

    useEffect(() => {
        const isLoggedIn = status === AuthStatus.FetchedAccountId
        if (!isLoggedIn) navigate('/login')
    }, [status])

    useEffect(() => {
        dispatch(fetchMovieDetails({accessTokenAuth, movieId: Number(id)}))
        dispatch(fetchMovieRecommendations({accessTokenAuth, movieId:  Number(id)}))
        dispatch(fetchMovieReviews({accessTokenAuth, movieId:  Number(id)}))
    }, [id]);

    return (
        <div className="detailed-page">
            <DetailedPageNav />
            <div className="movie-details">
                <div className="poster-info">
                    <Poster posterPath={movieDetails.poster_path} title={movieDetails.title} />
                    <div className="info">
                        <h2 className="title">{movieDetails.title}</h2>
                        <p className="release-date">Release Date: {movieDetails.release_date}</p>
                        <p className="genres">Genres: {movieDetails.genres.map(genre => genre.name).join(', ')}</p>
                        <p className="runtime">Runtime: {movieDetails.runtime} minutes</p>
                        <Rating movie={movieDetails} />
                        <p className="homepage">
                            <a href={movieDetails.homepage} target="_blank" rel="noopener noreferrer">Homepage</a>
                        </p>
                        <p className="imdb-link">
                            <a href={`https://www.imdb.com/title/${movieDetails.imdb_id}/?ref_=chtmvm_t_1`} target="_blank" rel="noopener noreferrer">IMDb</a>
                        </p>
                    </div>
                </div>
                <div className="overview">
                    <h3>Overview:</h3>
                    <p>{movieDetails.overview}</p>
                </div>
                <div className="production-companies">
                    <h3>Production Companies:</h3>
                    <ul>
                        {movieDetails.production_companies.map(company => (
                            <li key={company.name}>{company.name}</li>
                        ))}
                    </ul>   
                </div>
            </div>
            <div className="reviews">
                <h3>Reviews:</h3>
                <ul>
                    {movieReviews.map((review, index) => (
                        <li key={index} className="review">
                            <p><strong>{review.author}:</strong></p>
                            <p>{review.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="recommendations">
                <h3>Recommendations:</h3>
                <MoviesList movies={movieRecommendations} />
            </div>
        </div>
    );
}

export default DetailedPage
