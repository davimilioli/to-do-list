import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent {
 @Input() showModal!: boolean
 @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

}
