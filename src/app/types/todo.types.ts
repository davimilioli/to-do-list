export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoList  {
    page: number;
    pageSize: number;
    total: number;
    todos: Todo[];
}

export interface UpdateCompleted {
    id: number;
    completed: boolean;
}

export interface UpdateTitle {
    id: number;
    title: string;
}

export interface DeleteTodo {
    id: number;
    title: string;
}