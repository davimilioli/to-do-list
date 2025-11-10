import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoList } from '../../types/todo.types';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, TodoFormComponent, ModalDeleteComponent],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todoList!: TodoList;
  todo: Todo | null = null;
  editTodoId: number | null = null;
  showModal: boolean = false;

  constructor(private service: TodoService){
    this.loadTodos();
  }

  loadTodos(){
    this.service.getAllTodo().subscribe({
      next: (data) => {
        this.todoList = data;
        console.log(data)
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completo')
      }
    })
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.service.updateTodoCompleted(todo.id, todo.completed).subscribe({
      next: (data) => {
        todo.completed = data.completed
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completo')
      }
    })
  }

  enableEdit(id: number) {
    console.log(id)
    this.editTodoId = id;
  }

  cancelEdit(){
    this.editTodoId = null;
  }

  editTitle(todo: Todo) {
    if(!todo.title.trim()) return;

    this.service.updateTodoTitle(todo.id, todo.title).subscribe({
      next: (data) => {
        todo.title = data.title;
        this.cancelEdit();
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completo')
      }
    })
  }

  deleteTodo(todo: Todo) {
    this.service.deleteTodo(todo.id).subscribe({
      next: (data) => {
        this.loadTodos();
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completo')
      }
    })
  }

  onShowModal(todo: Todo | null){
    if(todo) this.todo = todo;
    this.showModal = true;
  }

  onCloseModal(todo?: Todo | null) {
    if (todo) this.deleteTodo(todo);
    this.showModal = false;
    this.todo = null;
  }

  insertTodo(title: string){
    this.service.addTodo(title).subscribe({
      next: (data) => {
        this.todoList.todos.push(data);
        this.todoList.total++;
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        console.log('completo')
      }
    })
  }

}
