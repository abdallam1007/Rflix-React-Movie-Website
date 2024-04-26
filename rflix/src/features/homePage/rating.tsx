import { useDispatch, useSelector } from "react-redux";
import { Movie, addOrUpdateMovieRating, addOrUpdateRating, deleteMovieRating, deleteRating, selectMyRatings } from "./homePageSlice";
import './styles/rating.css'
import { useState } from "react";
import { selectAccessTokenAuth } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";

interface RatingProps {
    movie: Movie
}

const Rating = ({ movie }: RatingProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [editMode, setEditMode] = useState(false);
    const [newRating, setNewRating] = useState(0);

    const myRatedMovies = useSelector(selectMyRatings);
    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    
    const myRating = myRatedMovies[movie.id]?.rating;
    const isMyRating = myRating !== undefined;
    const displayRating = isMyRating ? myRating : movie.vote_average;

    const handleDelete = () => {
        dispatch(deleteRating({accessTokenAuth, movieId: movie.id}))
        .then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(deleteMovieRating({movieId: movie.id}));
            }
        })
    }

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSubmitRating = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        dispatch(addOrUpdateRating({accessTokenAuth, movieId: movie.id , rating: newRating}))
        .then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(addOrUpdateMovieRating({movie, rating: newRating}));
            }
        })
    
        setEditMode(false)
    };

    return (
        <div className="rating">
            <p>Rating: {displayRating}</p>
            {isMyRating && !editMode && (
                <div className="actions">
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
            {!isMyRating && !editMode && (
                <form onSubmit={handleSubmitRating} className="rating-form">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        placeholder="Rate 1-10"
                        required
                    />
                    <button type="submit">Rate</button>
                </form>
            )}
            {editMode && (
                <form onSubmit={handleSubmitRating} className="rating-form">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        placeholder="Rate 1-10"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default Rating