import {useHttp} from '../../hooks/http.hook';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import Spinner from '../spinner/Spinner';

import { heroesAdd, heroesFetchingError } from '../heroesList/heroesSlice';
import { fetchFilters, selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store';

const HeroesAddForm = () => {
    const dispatch = useDispatch();
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const {request} = useHttp();
    const [heroName, setHeroName] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [heroElement, setHeroElement] = useState('');

    useEffect(() => {
        dispatch(fetchFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onAddHero = (e) => {
        e.preventDefault();

        const [name, description, element] = e.target

        const obj = {
            id: uuidv4(),
            name: name.value,
            description: description.value,
            element: element.value
        }

        request("http://localhost:3001/heroes", 'POST', JSON.stringify(obj))
            .then(dispatch(heroesAdd(obj)))
            .catch(() => dispatch(heroesFetchingError()))
        
        setHeroName('');
        setHeroDescription('');
        setHeroElement('');
    }

    const renderFilters = () => {
        if (filtersLoadingStatus === 'loading') {
            return <Spinner/>;
        } else if (filtersLoadingStatus === "error") {
            return <h5 className="text-center mt-5">Помилка загрузки</h5>
        }

        if (filters && filters.length > 0) {
            return filters.map(({value, text}) => {
                // eslint-disable-next-line array-callback-return
                if (value === 'all') return;

                return <option key={value} value={value}>{text}</option>
            }) 
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onAddHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Ім'я нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Як мене звати?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Опис</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Що я вмію?"
                    style={{"height": '130px'}}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Вибрати елемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option value="">Я володію елементом...</option>
                    {renderFilters(filters)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Створити</button>
        </form>
    )
}

export default HeroesAddForm;