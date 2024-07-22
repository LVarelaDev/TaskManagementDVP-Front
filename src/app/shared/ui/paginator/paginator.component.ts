import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorData } from '../../../models/paginatorModels';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  @Input() paginatorData?: PaginatorData;
  iconLeft = faChevronLeft;
  iconRight = faChevronRight;
  @Output() pageIndex = new EventEmitter<number>();

  ngOnInit(): void {
  }

  previousPage(): void {
    this.paginatorData!.currentPage = this.paginatorData!.currentPage - 1;
    this.pageIndex.emit(this.paginatorData!.currentPage);
  }

  nextPage(): void {
    this.paginatorData!.currentPage = this.paginatorData!.currentPage + 1;
    this.pageIndex.emit(this.paginatorData!.currentPage);
  }

  validPreviousPage(): boolean {
    if (this.paginatorData!.currentPage > 1) return true;
    return false;
  }

  validNextPage(): boolean {
    if (this.paginatorData!.currentPage < this.paginatorData!.totalPages)
      return true;
    return false;
  }
}
