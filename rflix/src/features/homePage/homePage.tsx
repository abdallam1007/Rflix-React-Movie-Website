import { useDispatch, useSelector } from "react-redux"
import PopularMovies from "./popularMovies"
import { AppDispatch } from "../../app/store"
import { fetchGenres, fetchMyRatings } from "./homePageSlice"
import { AuthStatus, selectAccountId, selectStatus } from "../auth/authSlice"
import { useEffect } from "react"
import TopRatedMovies from "./topRatedMovies"
import Search from "./search"
import HomePageNav from "./homePageNav"
import accessTokenAuth from '../../constants/config';
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const accountId = useSelector(selectAccountId)
    const status = useSelector(selectStatus)

    useEffect(() => {
        const isLoggedIn = status === AuthStatus.FetchedAccountId
        if (!isLoggedIn) navigate('/login')
    }, [status])


    useEffect(() => {
        const isLoggedIn = status === AuthStatus.FetchedAccountId

        if (!isLoggedIn)
        {
            navigate('/login')
        } 

        dispatch(fetchGenres(accessTokenAuth))
        dispatch(fetchMyRatings({accessTokenAuth, accountId}))
    }, [])

    return (
        <div>
            <HomePageNav />
            <Search />
            <PopularMovies />
            <TopRatedMovies />
        </div>
    )
}

export default HomePage
