import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Genre, Movie, Movies } from "../homePage/homePageSlice"
import axios from "axios"
import { RootState } from "../../app/store"

export interface DetailedPageState {
    movie: DetailedMovie,
    reviews: Review[],
    recommendations: Movie[]
}

export interface ProductionCompany {
    name: string
}

export interface DetailedMovie {
    id: number,
    poster_path: string,
    title: string,
    release_date: string,
    genres: Genre[],
    vote_average: number,
    homepage: string,
    imdb_id: string,
    overview: string,
    runtime: number,
    production_companies: ProductionCompany[],
    genre_ids: number[],
    rating: number
}

export interface Review {
    author: string,
    content: string
}
export interface ReviewsResponse {
    results: Review[]
}


const MOVIE_DETAILS_URL = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}`
const MOVIE_RECOMMENDATIONS_URL = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}/recommendations`
const MOVIE_REVIEWS_URL = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}/reviews`

export const fetchMovieDetails = createAsyncThunk('auth/fetchMovieDetails', async ({accessTokenAuth, movieId} : {accessTokenAuth: string; movieId: number}) => {
    const response = await axios.get(MOVIE_DETAILS_URL(movieId), {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const fetchMovieRecommendations = createAsyncThunk('auth/fetchMovieRecommendations', async ({accessTokenAuth, movieId} : {accessTokenAuth: string; movieId: number}) => {
    const response = await axios.get(MOVIE_RECOMMENDATIONS_URL(movieId), {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const fetchMovieReviews = createAsyncThunk('auth/fetchMovieReviews', async ({accessTokenAuth, movieId} : {accessTokenAuth: string; movieId: number}) => {
    const response = await axios.get(MOVIE_REVIEWS_URL(movieId), {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const initialState: DetailedPageState = {
    movie: {
        id: 0,
        poster_path: "",
        title: "",
        release_date: "",
        genres: [],
        vote_average: 0,
        homepage: "",
        imdb_id: "",
        overview: "",
        runtime: 0,
        production_companies: [],
        genre_ids: [],
        rating: 0
    },
    reviews: [],
    recommendations: []
}

const detailedPageSlice = createSlice({
    name: 'detailedPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMovieDetails.fulfilled, (state: DetailedPageState, action: PayloadAction<DetailedMovie>) => {
            state.movie = action.payload
        })

        builder.addCase(fetchMovieRecommendations.fulfilled, (state: DetailedPageState, action: PayloadAction<Movies>) => {
            state.recommendations = action.payload.results
        })

        builder.addCase(fetchMovieReviews.fulfilled, (state: DetailedPageState, action: PayloadAction<ReviewsResponse>) => {
            state.reviews = action.payload.results
        })
    }
})

export const selectMovieDetails = (state: RootState) => state.detailedPage.movie
export const selectMovieReviews = (state: RootState) => state.detailedPage.reviews
export const selectMovieRecommendations = (state: RootState) => state.detailedPage.recommendations

export default detailedPageSlice.reducer