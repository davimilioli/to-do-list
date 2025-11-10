import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoList } from '../../types/todo.types';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule,
    TodoFormComponent,
    ModalDeleteComponent,
    NotificationComponent
  ],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todoList!: TodoList;
  todo: Todo | null = null;
  editTodoId: number | null = null;
  showModal: boolean = false;

  showNotify: boolean = false;
  messageNotify!: string;
  statusNotify!: 'success' | 'error';

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
        this.notify('error', 'Erro ao alterar status de tarefa');
        console.log(error);
      },
      complete: () => {
        this.notify('success', `Tarefa ${todo.completed == true ? 'concluída' : 'em andamento'}`);
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
        this.notify('error', 'Erro ao alterar titulo da tarefa');
        console.log(error);
      },
      complete: () => {
        this.notify('success', `Titulo da tarefa alterado com sucesso`);
        console.log('completo')
      }
    })
  }

  deleteTodo(todo: Todo) {
    this.service.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todoList.todos = this.todoList.todos.filter(t => t.id !== todo.id);
        this.todoList.total--;
      },
      error: (error) => {
        this.notify('error', 'Erro ao excluir tarefa');
        console.log(error);
      },
      complete: () => {
        this.notify('success', `Tarefa excluída com sucesso`);
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
        this.notify('error', 'Erro ao criar tarefa');
        console.log(error);
      },
      complete: () => {
        this.notify('success', `Tarefa criada com sucesso`);
        console.log('completo')
      }
    })
  }

  private notify(status: 'success' | 'error', message: string){
    this.showNotify = true;
    this.statusNotify = status
    this.messageNotify = message;
    setTimeout(() => {
      this.showNotify = false;
    }, 5000)
  }

}
