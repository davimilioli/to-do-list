import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { DeleteTodo, Todo } from '../../types/todo.types';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent{
 @Input() showModal!: boolean
 @Input() todo!: DeleteTodo;
 @Output() close = new EventEmitter<number | null>();

  closeModal(id?: number) {
    this.close.emit(id ?? null);
  }
}
