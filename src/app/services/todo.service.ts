import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoList } from '../types/todo.types';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getAllTodo(): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.apiUrl}/todo`);
  }
  
  updateTodoCompleted(id: number, completed: boolean): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/todo/${id}`, { completed });
  }
  
  updateTodoTitle(id: number, title: string): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/todo/${id}`, { title })
  }

  deleteTodo(id: number) {
    
  }


}
