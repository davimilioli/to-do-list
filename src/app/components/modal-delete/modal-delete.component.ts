import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { Todo } from '../../types/todo.types';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent{
 @Input() showModal!: boolean
 @Input() todo!: Todo;
 @Output() close = new EventEmitter<Todo | null>();

  closeModal(todo?: Todo | null) {
    this.close.emit(todo ?? null);
  }
}
