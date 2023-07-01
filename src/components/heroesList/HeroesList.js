import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { heroesDelete, fetchHeroes, filteredHeroesSelector } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    
    const heroesToShow = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(heroesDelete(id)))
            .catch((err) => console.log(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Помилка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition classNames="hero" timeout={0}>
                    <h5 className="text-center mt-5">Героїв поки немає</h5>
                </CSSTransition>
            );
            
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} classNames="hero" timeout={400}>
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            );
        })
    }

    const elements = renderHeroesList(heroesToShow);
    return (
        <TransitionGroup component={'ul'}>
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;