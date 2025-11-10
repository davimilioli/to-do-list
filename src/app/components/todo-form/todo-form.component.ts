import { Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  @Output() newTodo = new EventEmitter<string>();

  newTodoTitle: string = '';

  submit(){
    if(!this.newTodoTitle.trim()) return;
    this.newTodo.emit(this.newTodoTitle);
    this.newTodoTitle = '';
  }

}
