import { Component, OnInit, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoList, UpdateCompleted, UpdateTitle, DeleteTodo } from '../../types/todo.types';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { PaginationButtonsComponent } from '../../components/pagination-buttons/pagination-buttons.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule,
    TodoFormComponent,
    TodoListComponent,
    ModalDeleteComponent,
    NotificationComponent,
    FilterComponent,
    PaginationButtonsComponent
  ],
  providers: [TodoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
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
  modalInfo: { id: number, title: string } | null = null

  showNotify: boolean = false;
  messageNotify!: string;
  statusNotify!: 'success' | 'error';

  currentFilter: string = 'all';
  countFilterAll: number = 0;
  countFilterActive: number = 0;
  countFilterCompleted: number = 0;

  constructor(private service: TodoService){}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(){
    this.service.getAllTodo(1,12).subscribe({
      next: (data) => {
        this.todoList.set(data);
        this.todoOriginal.set(data.todos);
        this.filterUpdateCounts();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onUpdateCompleted(todo: any){
    this.service.updateTodoCompleted(todo.id, todo.completed).subscribe({
      next: (data) => {
        this.todoOriginal.update(prev =>
          prev.map(t => t.id === todo.id ? { ...t, completed: data.completed }: t)
        );

        if (this.currentFilter === 'completed' && !data.completed) {
          this.currentFilter = 'active';
        }

        if (this.currentFilter === 'active' && data.completed) {
          this.currentFilter = 'completed';
        }

        this.filterList(this.currentFilter);
        this.filterUpdateCounts();

        this.notify('success', `Tarefa ${data.completed ? 'concluída' : 'em andamento'}`);
      },
      error: (error) => {
        this.notify('error', 'Erro ao alterar status de tarefa');
        console.log(error);
      }
    })
  }

  onUpdateTitle(todo: any) {
    if(!todo.title.trim()) return;

    this.service.updateTodoTitle(todo.id, todo.title).subscribe({
      next: (data) => {
        todo.title = data.title;
        this.notify('success', `Titulo da tarefa alterado com sucesso`);
      },
      error: (error) => {
        this.notify('error', 'Erro ao alterar titulo da tarefa');
        console.log(error);
      }
    })
  }

  onDeleteTodo(id: number) {
    this.service.deleteTodo(id).subscribe({
      next: () => {
        this.todoOriginal.update(list => list.filter(t => t.id !== id));

        if (this.currentFilter === 'completed' && this.todoOriginal().filter(t => t.completed).length === 0) {
          this.currentFilter = 'all';
        }

        this.filterList(this.currentFilter);
        this.filterUpdateCounts();

        this.notify('success', `Tarefa excluída com sucesso`);
      },
      error: (error) => {
        this.notify('error', 'Erro ao excluir tarefa');
        console.log(error);
      }
    });
  }

  onShowModalDelete(todo: DeleteTodo){
    if(todo) this.modalInfo = todo;
    this.showModal = true;
  }

  onCloseModal(id: number | null) {
    if (id) this.onDeleteTodo(id);
    this.showModal = false;
    this.todo = null;
  }

  insertTodo(title: string){
    this.service.addTodo(title).subscribe({
      next: (data) => {
        this.todoOriginal.update(prev => [...prev, data]);
        this.filterList(this.currentFilter);
        this.filterUpdateCounts();

        this.notify('success', `Tarefa criada com sucesso`);
      },
      error: (error) => {
        this.notify('error', 'Erro ao criar tarefa');
        console.log(error);
      },

    });
  }

  filterList(filter: string) {

    if (filter === 'clear') {
      this.filterClear();
      return;
    }

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

  filterUpdateCounts() {
    const original = this.todoOriginal();

    this.countFilterAll = original.length;
    this.countFilterActive = original.filter(t => !t.completed).length;
    this.countFilterCompleted = original.filter(t => t.completed).length;
  }

  filterClear() {
    const completedTodos = this.todoOriginal().filter(t => t.completed);

    if (completedTodos.length === 0) return;

    this.todoOriginal.update(prev => prev.filter(t => !t.completed));

    this.currentFilter = 'all';

    this.filterList('all');

    this.filterUpdateCounts();

    completedTodos.forEach(t => {
      this.service.deleteTodo(t.id).subscribe({
        error: (error) => {
          this.notify('error', 'Erro ao excluir tarefas');
          console.log(error);
        }
      });
    });

    this.notify('success', 'Tarefas concluídas removidas');
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
