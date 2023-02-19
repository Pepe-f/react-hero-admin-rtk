import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useHttp } from '../../hooks/useHttp'
import { heroCreated } from '../../store/slices/heroesSlice'
import { selectAll } from '../../store/slices/filtersSlice'
import store from '../../store'

const HeroesAddForm = () => {
  const [heroName, setHeroName] = useState('')
  const [heroText, setHeroText] = useState('')
  const [heroElement, setHeroElement] = useState('')

  const { filtersLoadingStatus } = useSelector(state => state.filtersReducer)
  const filters = selectAll(store.getState())
  const dispatch = useDispatch()
  const { request } = useHttp()

  const submitHandler = e => {
    e.preventDefault()

    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroText,
      element: heroElement
    }

    request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
      .then(dispatch(heroCreated(newHero)))
      .catch(e => console.log(e))

    setHeroName('')
    setHeroText('')
    setHeroElement('')
  }

  const renderFilters = (filters, status) => {
    if (status === 'loading') {
      return <option>Загрузка элементов</option>
    } else if (status === 'error') {
      return <option>Ошибка загрузки</option>
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name !== 'all') {
          return (
            <option key={name} value={name}>
              {label}
            </option>
          )
        }
      })
    }
  }

  return (
    <form className='border p-4 shadow-lg rounded' onSubmit={submitHandler}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label fs-4'>
          Имя нового героя
        </label>
        <input
          required
          type='text'
          name='name'
          className='form-control'
          id='name'
          placeholder='Как меня зовут?'
          value={heroName}
          onChange={e => setHeroName(e.target.value)}
        />
      </div>

      <div className='mb-3'>
        <label htmlFor='text' className='form-label fs-4'>
          Описание
        </label>
        <textarea
          required
          name='text'
          className='form-control'
          id='text'
          placeholder='Что я умею?'
          style={{ height: '130px' }}
          value={heroText}
          onChange={e => setHeroText(e.target.value)}
        />
      </div>

      <div className='mb-3'>
        <label htmlFor='element' className='form-label'>
          Выбрать элемент героя
        </label>
        <select
          required
          className='form-select'
          id='element'
          name='element'
          value={heroElement}
          onChange={e => setHeroElement(e.target.value)}
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type='submit' className='btn btn-primary'>
        Создать
      </button>
    </form>
  )
}

export default HeroesAddForm
