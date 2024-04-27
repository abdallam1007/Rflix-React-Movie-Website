import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../../app/store"

export interface Dictionary<T> {
    [key: number]: T
}

export enum Status {
    Idle,
    Loading,
    Succeded,
    Failed
}

export interface HomePageState {
    genres: Dictionary<string>,
    myRatings: Dictionary<Movie>,
    popular: Dictionary<Movie>,
    topRated: Dictionary<Movie>,
    search: Dictionary<Movie>
}

export interface Movie {
    id: number,
    genre_ids: number[],
    poster_path: string,
    release_date: string,
    title: string,
    vote_average: number,
    rating: number
}

export interface Movies {
    page: number,
    results: Movie[]
}

export interface Genre {
    id: number;
    name: string;
  }
  
  interface GenresResponse {
    genres: Genre[];
  }


const POPULAR_MOVIES_URL = 'https://api.themoviedb.org/3/movie/popular'
const TOP_RATED_MOVIES_URL = 'https://api.themoviedb.org/3/movie/top_rated'
const GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list'
const MY_RATINGS_URL = (accountId: number) => `https://api.themoviedb.org/3/account/${accountId}/rated/movies`
const ADD_UPDATE_MOVIE_RATING = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}/rating`
const DELETE_MOVIE_RATING = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}/rating`
const SEARCH_MOVIES_URL = 'https://api.themoviedb.org/3/search/movie'


function mapMoviesToDictionary(moviesResponse: Movie[]): Dictionary<Movie> {
    const movieDictionary: Dictionary<Movie> = {}
    moviesResponse.forEach((movie) => {
        movieDictionary[movie.id] = movie
    })
    return movieDictionary
}

function mapGenresToDictionary(genresResponse: GenresResponse): Dictionary<string> {
    const dictionary: Dictionary<string> = {};
    genresResponse.genres.forEach(genre => {
      dictionary[genre.id] = genre.name
    })
    return dictionary
  }

export const initialState: HomePageState = {
    genres: {},
    myRatings: {},
    popular: {},
    topRated: {},
    search: {}
}

export const fetchPopularMovies = createAsyncThunk('auth/fetchPopularMovies', async ({accessTokenAuth, pageNumber} : {accessTokenAuth: string; pageNumber: number}) => {
    const response = await axios.get<Movies>(POPULAR_MOVIES_URL, {
        params: {
            page: pageNumber
        },
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const fetchTopRatedMovies = createAsyncThunk('auth/fetchTopRatedMovies', async ({accessTokenAuth, pageNumber} : {accessTokenAuth: string; pageNumber: number}) => {
    const response = await axios.get<Movies>(TOP_RATED_MOVIES_URL, {
        params: {
            page: pageNumber
        },
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const fetchGenres = createAsyncThunk('auth/fetchGenres', async (accessTokenAuth: string) => {
    const response = await axios.get(GENRES_URL, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const fetchMyRatings = createAsyncThunk('auth/fetchMyRatings', async ({accessTokenAuth, accountId} : {accessTokenAuth: string; accountId: number}) => {
    const response = await axios.get(MY_RATINGS_URL(accountId), {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

export const addOrUpdateRating = createAsyncThunk('auth/addOrUpdateRating', async ({accessTokenAuth, movieId, rating} : {accessTokenAuth: string; movieId: number, rating: number}) => {
    const response = await axios.post(
        ADD_UPDATE_MOVIE_RATING(movieId),
        {
            'value': rating
        },
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessTokenAuth}`
            }
        })
    return response.data
})

export const deleteRating = createAsyncThunk('auth/deleteRating', async ({accessTokenAuth, movieId} : {accessTokenAuth: string; movieId: number}) => {
    const response = await axios.delete(
        DELETE_MOVIE_RATING(movieId),
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessTokenAuth}`
            }
        })
    return response.data
})

export const fetchFilteredMovies = createAsyncThunk('auth/fetchFilteredMovies', async ({accessTokenAuth, title} : {accessTokenAuth: string; title: string}) => {
    const response = await axios.get(SEARCH_MOVIES_URL, {
        params: {
            query: title
        },
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessTokenAuth}`
        }
    })
    return response.data
})

const homePageSlice = createSlice({
    name: 'homePage',
    initialState,
    reducers: {
        setGenres(state: HomePageState, action: PayloadAction<string>) {
            state.genres = action.payload
        },
        setMyRatings(state: HomePageState, action: PayloadAction<Dictionary<Movie>>) {
            state.myRatings = action.payload
        },
        setPopularMovies(state: HomePageState, action: PayloadAction<Dictionary<Movie>>) {
            state.popular = action.payload
        },
        setTopRatedMovies(state: HomePageState, action: PayloadAction<Dictionary<Movie>>) {
            state.topRated = action.payload
        },
        addOrUpdateMovieRating(state: HomePageState, action: PayloadAction<{movie: Movie, rating: number}>) {
            const { movie, rating } = action.payload;
            const { id } = movie;
            if (state.myRatings[id]) {
                state.myRatings[id].rating = rating;
            } else {
                state.myRatings[id] = { ...movie, rating };
            }
        },
        deleteMovieRating(state: HomePageState, action: PayloadAction<{movieId: number}>) {
            const { movieId } = action.payload;
            delete state.myRatings[movieId];
        }
    },

    extraReducers: (builder) => {
        builder.addCase(fetchPopularMovies.fulfilled, (state: HomePageState, action: PayloadAction<Movies>) => {
            const movies = mapMoviesToDictionary(action.payload.results)
            state.popular = movies
        })

        builder.addCase(fetchTopRatedMovies.fulfilled, (state: HomePageState, action: PayloadAction<Movies>) => {
            const movies = mapMoviesToDictionary(action.payload.results)
            state.topRated = movies
        })

        builder.addCase(fetchGenres.fulfilled, (state: HomePageState, action: PayloadAction<GenresResponse>) => {
            const genres = mapGenresToDictionary(action.payload)
            state.genres = genres
        })

        builder.addCase(fetchMyRatings.fulfilled, (state: HomePageState, action: PayloadAction<Movies>) => {
            const moviesRated = mapMoviesToDictionary(action.payload.results)
            state.myRatings = moviesRated
        })

        builder.addCase(fetchFilteredMovies.fulfilled, (state: HomePageState, action: PayloadAction<Movies>) => {
            const moviesRated = mapMoviesToDictionary(action.payload.results)
            state.search = moviesRated
        })
    } 
})

export const selectgenres = (state: RootState) => state.homePage.genres
export const selectMyRatings = (state: RootState) => state.homePage.myRatings
export const selectPopularMovies = (state: RootState) => state.homePage.popular
export const selectTopRatedMovies = (state: RootState) => state.homePage.topRated
export const selectFilteredMovies = (state: RootState) => state.homePage.search

export const { setGenres, setMyRatings, setPopularMovies, setTopRatedMovies, addOrUpdateMovieRating, deleteMovieRating } = homePageSlice.actions;

export default homePageSlice.reducer