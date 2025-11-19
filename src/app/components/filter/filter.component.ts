import { Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent{
  @Input() currentFilter: string = 'all';
  @Input() countAll: number = 0;
  @Input() countActive: number = 0;
  @Input() countCompleted: number = 0;
  @Output() filter = new EventEmitter<string>();

  filterList(value: string) {
    this.currentFilter = value;
    this.filter.emit(value); 
  }
}
