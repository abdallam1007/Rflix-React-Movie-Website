import { useDispatch, useSelector } from "react-redux"
import { fetchMyRatings, selectMyRatings } from "./homePageSlice"
import MoviesList from "./moviesList"
import MyRatingsNav from "./myRatingsNav"
import { AppDispatch } from "../../app/store"
import { useEffect } from "react"
import accessTokenAuth from "../../constants/config"
import { AuthStatus, selectAccountId, selectStatus } from "../auth/authSlice"
import { useNavigate } from "react-router-dom"



const MyRatings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const ratedMovies = useSelector(selectMyRatings)
  const accountId = useSelector(selectAccountId)

  const status = useSelector(selectStatus)

  useEffect(() => {
      const isLoggedIn = status === AuthStatus.FetchedAccountId
      if (!isLoggedIn) navigate('/login')
  }, [status])

  useEffect(() => {
      dispatch(fetchMyRatings({accessTokenAuth, accountId}))
  }, [])

  return (
    <div>
        <MyRatingsNav />
        <h2 className="rated-movies-heading">Rated Movies</h2>
        <MoviesList movies={ratedMovies} />
    </div>
  )
}

export default MyRatings
