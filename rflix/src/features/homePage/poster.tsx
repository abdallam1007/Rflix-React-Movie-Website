import './styles/poster.css'

interface PosterProps {
    posterPath: string,
    title: string
}

const Poster = ({ posterPath, title }: PosterProps) => {
    const MOVIE_POSTER_PREFIX_URL = 'https://image.tmdb.org/t/p/w220_and_h330_face'
    const posterUrl = MOVIE_POSTER_PREFIX_URL + posterPath;
  
    return (
      <div className="poster">
          <img src={posterUrl} alt={title} />
      </div>
  );
  };
  
  export default Poster;
  
