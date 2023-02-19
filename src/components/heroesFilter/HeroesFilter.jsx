import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  activeFilterChanged,
  filtersFetch,
  selectAll
} from '../../store/slices/filtersSlice'
import store from '../../store'
import Spinner from '../spinner/Spinner'

const HeroesFilters = () => {
  const { filtersLoadingStatus, activeFilter } = useSelector(
    state => state.filtersReducer
  )
  const filters = selectAll(store.getState())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(filtersFetch())
  }, [])

  if (filtersLoadingStatus === 'loading') {
    return <Spinner />
  } else if (filtersLoadingStatus === 'error') {
    return <h5 className='text-center mt-5'>Ошибка загрузки</h5>
  }

  const renderFilters = filters => {
    if (filters.length === 0) {
      return <h5 className='text-center mt-5'>Фильтры не найдены</h5>
    }

    return filters.map(({ name, label, className }) => {
      const btnClass = classNames('btn', className, {
        active: name === activeFilter
      })

      return (
        <button
          key={name}
          id={name}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(name))}
        >
          {label}
        </button>
      )
    })
  }

  return (
    <div className='card shadow-lg mt-4'>
      <div className='card-body'>
        <p className='card-text'>Отфильтруйте героев по элементам</p>
        <div className='btn-group'>{renderFilters(filters)}</div>
      </div>
    </div>
  )
}

export default HeroesFilters
