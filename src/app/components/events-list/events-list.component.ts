import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BlogService } from '../../services/blog.service';
import { RecentArticleMeta } from '../../types/Article.types';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-list.component.html',
})
export class EventsListComponent implements OnInit {
  readonly title = input<string>('Save the Date!');
  readonly description = input<string>('');
  readonly articlePaths = input<string[]>();

  readonly events = signal<RecentArticleMeta[]>([]);

  readonly #blogService = inject(BlogService);

  ngOnInit(): void {
    const paths = this.articlePaths();
    if (!paths || paths.length === 0) return;

    forkJoin(paths.map(path => this.#blogService.getPostHeader(path))).subscribe((events) => {
      this.events.set(events);
    });
  }
}
