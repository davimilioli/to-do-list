import { Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent{
  @Input() currentFilter: string = 'all';
  @Output() filter = new EventEmitter<string>();

  countAll = 0
  countActive = 0
  countCompleted = 0

  filterList(value: string) {
    this.currentFilter = value;
    this.filter.emit(value); 
  }
}
