import { Component, Input, Output, signal, EventEmitter} from '@angular/core';
import { Todo, UpdateCompleted, UpdateTitle, DeleteTodo } from '../../types/todo.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  imports: [FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent{
  @Input() todos!: any;
  @Output() updateCompleted = new EventEmitter<UpdateCompleted>();
  @Output() updateTitle = new EventEmitter<UpdateTitle>();
  @Output() showModalDelete = new EventEmitter<DeleteTodo>();
  editTodoId: number | null = null;

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.updateCompleted.emit({ id: todo.id, completed: todo.completed });
  }

  enableEdit(id: number) {
    console.log(id)
    this.editTodoId = id;
  }

  cancelEdit(){
    this.editTodoId = null;
  }

  editTitle(todo: Todo){
    this.updateTitle.emit({ id: todo.id, title: todo.title });
  }

  delTodo(todo: Todo){
    this.showModalDelete.emit({ id: todo.id, title: todo.title });
  }
  
  

}
