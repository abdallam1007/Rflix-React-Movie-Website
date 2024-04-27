import { useSelector } from "react-redux"
import { selectMyRatings } from "./homePageSlice"
import MoviesList from "./moviesList"
import MyRatingsNav from "./myRatingsNav"



const MyRatings = () => {
    const popularMovies = useSelector(selectMyRatings)

  return (
    <div>
        <MyRatingsNav />
        <h2 className="rated-movies-heading">Rated Movies</h2>
        <MoviesList movies={popularMovies} />
    </div>
  )
}

export default MyRatings
