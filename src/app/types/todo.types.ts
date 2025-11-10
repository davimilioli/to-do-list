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