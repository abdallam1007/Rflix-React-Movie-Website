import { useDispatch, useSelector } from "react-redux";
import { Movie, addOrUpdateMovieRating, addOrUpdateRating, selectMyRatings } from "./homePageSlice";
import { useEffect, useState } from "react";
import accessTokenAuth from '../../constants/config';
import { AppDispatch } from "../../app/store";
import { Rating as MuiRating } from '@mui/material';

interface RatingProps {
    movie: Movie
}

const Rating = ({ movie }: RatingProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const myRatedMovies = useSelector(selectMyRatings);

    const myRating = myRatedMovies[movie.id]? myRatedMovies[movie.id].rating : null
    const [newRating, setNewRating] = useState<number | null>(myRating);

    useEffect(() => {
        if(newRating != null) {
            dispatch(addOrUpdateRating({accessTokenAuth, movieId: movie.id , rating: newRating? newRating : 0}))
            .then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    dispatch(addOrUpdateMovieRating({movie, rating: newRating? newRating : 0}));
                }
            })
        }
    }, [newRating]);

    return (
        <div className="rating">
            <MuiRating
                name={`movie-rating-${movie.id}`}
                value={myRating ? myRating : (movie.vote_average / 2)}
                precision={0.5}
                onChange={(_, newValue) => setNewRating(newValue)}
            />
        </div>
    );
};

export default Rating