import { Component, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoList } from '../../types/todo.types';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule,
    TodoFormComponent,
    ModalDeleteComponent,
    NotificationComponent,
    FilterComponent,
    LoadingComponent
  ],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todoList = signal<TodoList>(
    {
      page: 1,
      pageSize: 12,
      total: 0,
      todos: []
    }
  );

  todoOriginal = signal<Todo[]>([]);
  todo: Todo | null = null;
  editTodoId: number | null = null;
  showModal: boolean = false;

  showNotify: boolean = false;
  messageNotify!: string;
  statusNotify!: 'success' | 'error';

  currentFilter: string = 'all';


  constructor(private service: TodoService){
    this.loadTodos();
  }

  loadTodos(){
    this.service.getAllTodo().subscribe({
      next: (data) => {
        this.todoList.set(data);
        this.todoOriginal.set(data.todos);
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
        this.todoList.update(prev => {
          const filtered = prev.todos.filter(t => t.id !== todo.id);
          return { ...prev, todos: filtered, total: filtered.length}
        });

        this.todoOriginal.update(list => list.filter(t => t.id !== todo.id));
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
        this.todoList.update(prev => {
          const updateTodos = [...prev.todos, data];
          return {
            ...prev,
            todos: updateTodos,
            total: updateTodos.length
          }
        });
        this.todoOriginal.update(prev => [...prev, data]);
        this.filterList(this.currentFilter);
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

  filterList(filter: string) {
    this.currentFilter = filter;

    const original = this.todoOriginal();
    let filtered = [...original];

    if(filter === 'active') filtered = original.filter(t => !t.completed);
    if(filter === 'completed') filtered = original.filter(t => t.completed);
    if(filter === 'clear') this.filterClear();

    this.todoList.update(prev => ({
      ...prev,
      todos: filtered,
      total: filtered.length
    }));
  }

  filterClear() {
    const original = this.todoOriginal();
    const completedTodos = original.filter(t => t.completed);

    completedTodos.forEach(t => {
      this.service.deleteTodo(t.id).subscribe({
        next: () => {
          this.todoOriginal.update(prev => prev.filter(t => !t.completed));
          this.todoList.update(prev => ({
            ...prev,
            todos: prev.todos,
            total: prev.todos.length
          }));;
          this.currentFilter = 'all';
        },
        error: (error) => {
          this.notify('error', 'Erro ao excluir tarefas');
          console.log(error);
        },
        complete: () => {
          this.notify('success', `Tarefas excluídas com sucesso`);
        }
      })
    })
  }

}
