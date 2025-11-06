import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoList } from '../../types/Todo';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ModalDeleteComponent],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todoList!: TodoList;
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
    if(!todo.title.trim()) {
      return;
    }

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
    this.onShowModal();
    console.log(todo)
  }

  onShowModal(){
    this.showModal = true;
  }

  onCloseModal(){
    this.showModal = false;
  }

}
