import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from '../../store';
import { changeActiveFilter, fetchFilters, selectAll } from "./filtersSlice";

import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const filters = selectAll(store.getState());

    useEffect(() => {
        dispatch(fetchFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderFilters = () => {
        if (filtersLoadingStatus === 'loading') {
            return <Spinner/>;
        } else if (filtersLoadingStatus === "error") {
            return <h5 className="text-center mt-5">Помилка загрузки</h5>
        }
        if (filters && filters.length > 0) {
            return filters.map(({value, text, className}) => {
                let activeClass = '';
                if(value === activeFilter) {
                    activeClass = 'active';
                }
                return <button
                        className={`btn ${className} ${activeClass}`}
                        onClick={() => dispatch(changeActiveFilter(value))}
                        key={value}>{text}</button>
            }) 
        }
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Відфільтруйте героїв по елементам</p>
                <div className="btn-group">
                    {renderFilters(filters)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;