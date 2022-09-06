import {v1} from 'uuid';
import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AppThunk} from './store';


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export  type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>

export type SetTodolistActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistActionType

export let todolistId1 = v1();
export let todolistId2 = v1();

const initialState: Array<TodolistDomainType> = [
    /*   {id: todolistId1, title: "What to learn", filter: "all"},
       {id: todolistId2, title: "What to buy", filter: "all"},*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = {...action.todolist, filter: 'all'}
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id)
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: 'all'
                }
            })
        }
        default:
            return state;

    }
}


export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    id
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    id
} as const)

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistActionType => ({
    type: 'SET-TODOLISTS',
    todolists
} as const)


export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        todolistAPI.getTodolists().then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
    }
}

export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC(todolistId))
        })
    }
}

export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.createTodolist(title).then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
    }
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.updateTodolistTitle(id, title).then((res) => {
            dispatch(changeTodolistTitleAC(id, title))
        })
    }
}



