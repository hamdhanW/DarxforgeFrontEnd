import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {NavBarComponent} from "../nav-bar/nav-bar.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavBarComponent,
    MatSlideToggle],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{

  middleCardIndex: number = 0;
  constructor(private el: ElementRef, private renderer: Renderer2) { }


  ngOnInit(): void {
    this.duplicateTestimonialCards();
    this.observeContainers(['testimonial-container', 'client-section-container']);

  }

  duplicateTestimonialCards() {
    const container = document.querySelector('.testimonial-cards-container');
    if (container) {
      const cards = Array.from(container.children);
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        container.appendChild(clone);
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const container = this.el.nativeElement.querySelector('.testimonial-cards-wrapper');
    const cards = this.el.nativeElement.querySelectorAll('.testimonial-card');
    const containerRect = container.getBoundingClientRect();
    const middlePoint = containerRect.left + containerRect.width / 2;

    cards.forEach((card: HTMLElement) => {
      const cardRect = card.getBoundingClientRect();
      const cardMiddle = cardRect.left + cardRect.width / 2;
      if (Math.abs(middlePoint - cardMiddle) < cardRect.width / 2) {
        this.renderer.addClass(card, 'zoom');
      } else {
        this.renderer.removeClass(card, 'zoom');
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const container = this.el.nativeElement.querySelector('.testimonial-container');
    if (container) {
      const containerPosition = container.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (containerPosition < windowHeight && containerPosition > 0) {
        this.renderer.removeClass(container, 'zoomed');
        this.renderer.addClass(container, 'normal');
      } else {
        this.renderer.removeClass(container, 'normal');
        this.renderer.addClass(container, 'zoomed');
      }
    }
  }

  observeContainers(containerClassNames: string[]) {
    const options = {
      root: null, // relative to the viewport
      rootMargin: '0px',
      threshold: 0.2 // 20% visibility
    };

    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        const container = entry.target;
        if (entry.isIntersecting) {
          this.renderer.addClass(container, 'slide-up');
          this.renderer.removeClass(container, 'slide-down');
        } else {
          this.renderer.removeClass(container, 'slide-up');
          this.renderer.addClass(container, 'slide-down');
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    containerClassNames.forEach(className => {
      const container = this.el.nativeElement.querySelector(`.${className}`);
      if (container) {
        observer.observe(container);
      }
    });
  }

}
