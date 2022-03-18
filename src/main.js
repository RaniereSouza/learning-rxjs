import { BehaviorSubject, fromEvent } from 'rxjs'
import { auditTime, debounceTime }    from 'rxjs/operators'

import './styles/global.css'

const search    = document.querySelector('.todo-list-search')
const container = document.querySelector('.todo-list-container')
const input     = container.querySelector('.todo-list-input')
const addButton = container.querySelector('.todo-list-input-button')
const list      = container.querySelector('.todo-list')

function addItemToList(content) {
  if ((typeof content !== 'string') || (content.trim() === '')) return

  const listItem = document.createElement('li')
  listItem.classList.add('todo-list-item')
  listItem.textContent = content
  list.appendChild(listItem)

  const listItemCheck = document.createElement('input')
  listItemCheck.classList.add('todo-list-item-check')
  listItemCheck.setAttribute('type', 'checkbox')
  listItem.prepend(listItemCheck)

  fromEvent(listItemCheck, 'change').subscribe(() =>
    listItem.classList.toggle('done')
  )

  return listItem
}

const items    = []
const itemsObs = new BehaviorSubject('An example of a To Do item.')
itemsObs.subscribe(value => {
  const element = addItemToList(value)
  element && items.push({value, element})
  console.log(items)
})

const searchObs = fromEvent(search, 'input').pipe(auditTime(1000))
searchObs.subscribe(({ target }) => {
  const searchItem = target.value
  console.log(searchItem)
})

let newItem = ''
const inputObs = fromEvent(input, 'input').pipe(debounceTime(1000))
inputObs.subscribe(({ target }) => {
  newItem = target.value
  console.log(newItem)
})
fromEvent(addButton, 'click').subscribe(() => {
  if (newItem.trim() !== '') {
    itemsObs.next(newItem)
    input.value = ''
    newItem = ''
  }
})
