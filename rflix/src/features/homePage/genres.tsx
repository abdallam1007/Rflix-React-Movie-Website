import { useSelector } from "react-redux";
import { selectgenres } from "./homePageSlice";
import './styles/genres.css'

interface GenresProps {
    genreIds : number[]
}

const Genres = ({ genreIds }: GenresProps) => {
    const genres = useSelector(selectgenres)

    const genreNames = genreIds.map(id => genres[id] || "Unknown Genre").join(', ')

    return (
        <div className="genres">
            <p>Genres: {genreNames}</p>
        </div>
    );
}

export default Genres