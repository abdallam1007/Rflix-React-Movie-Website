import { useDispatch, useSelector } from "react-redux"
import PopularMovies from "./popularMovies"
import { AppDispatch } from "../../app/store"
import { fetchGenres, fetchMyRatings } from "./homePageSlice"
import { selectAccessTokenAuth, selectAccountId } from "../auth/authSlice"
import { useEffect } from "react"
import TopRatedMovies from "./topRatedMovies"

const HomePage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const accessTokenAuth = useSelector(selectAccessTokenAuth)
    const accountId = useSelector(selectAccountId)

    useEffect(() => {
        dispatch(fetchGenres(accessTokenAuth))
        dispatch(fetchMyRatings({accessTokenAuth, accountId}))
    }, [])

    return (
        <div>
            <PopularMovies />
            <TopRatedMovies />
        </div>
    )
}

export default HomePage
