import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  useDeleteHeroMutation,
  useGetHeroesQuery
} from '../../store/slices/apiSlice'
import Spinner from '../spinner/Spinner'
import HeroesListItem from '../heroesListItem/HeroesListItem'

import './heroesList.scss'

const HeroesList = () => {
  const { data: heroes = [], isLoading, isError } = useGetHeroesQuery()
  const [deleteHero] = useDeleteHeroMutation()

  const activeFilter = useSelector(state => state.filtersReducer.activeFilter)

  const filteredHeroes = useMemo(() => {
    const filteredHeroes = heroes.slice()

    if (activeFilter === 'all') {
      return filteredHeroes
    } else {
      return filteredHeroes.filter(hero => hero.element === activeFilter)
    }
  }, [heroes, activeFilter])

  const onDelete = useCallback(id => {
    deleteHero(id)
  }, [])

  if (isLoading) {
    return <Spinner />
  } else if (isError) {
    return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
  }

  const renderHeroesList = heroes => {
    if (heroes.length === 0) {
      return (
        <CSSTransition timeout={0} classNames='hero'>
          <h5 className='text-center mt-5'>Героев пока нет</h5>
        </CSSTransition>
      )
    }

    return heroes.map(({ id, ...props }) => {
      return (
        <CSSTransition key={id} timeout={500} classNames='hero'>
          <HeroesListItem {...props} onDelete={() => onDelete(id)} />
        </CSSTransition>
      )
    })
  }

  return (
    <TransitionGroup component='ul'>
      {renderHeroesList(filteredHeroes)}
    </TransitionGroup>
  )
}

export default HeroesList
