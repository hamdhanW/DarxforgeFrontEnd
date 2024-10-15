import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatInputModule } from "@angular/material/input"; // Add this import
import { MatButtonModule } from "@angular/material/button"; // Add this
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavBarComponent,
    MatSlideToggle,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatInputModule, // Add this to the imports array
    MatButtonModule, // Add this
    MatFormField,
    ReactiveFormsModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  middleCardIndex: number = 0;
  contactForm!: FormGroup; // Use the non-null assertion operator (!) or initialize it properly

  constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.duplicateTestimonialCards();
    this.observeContainers(['testimonial-container', 'client-section-container']);
    this.initVideoNavigation();
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formValues = this.contactForm.value;

      emailjs.send('service_x5a956q', 'template_ln77a69'
        , {
        from_name: formValues.firstName,
        user_email: formValues.email,
        message: formValues.description
      }
      ,'C7yvcsm8B1aNC9bfk')
        .then((result: EmailJSResponseStatus) => {
          console.log('Email sent', result.text);
        }, (error) => {
          console.error('Failed to send email', error.text);
        });
    }
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

  initVideoNavigation() {
    const videoElements = this.el.nativeElement.querySelectorAll('.portfolio-video');
    const navDots = this.el.nativeElement.querySelectorAll('.nav-dot');

    if (videoElements.length && navDots.length) {
      // Initially show the first video
      this.showVideo(videoElements[0], navDots[0]);

      navDots.forEach((dot: HTMLElement, index: number) => {
        dot.addEventListener('click', () => {
          this.showVideo(videoElements[index], dot);
        });
      });

      // Add hover effect
      videoElements.forEach((video: HTMLElement, index: number) => {
        video.addEventListener('mouseenter', () => {
          this.centerVideo(video);
          this.showVideo(video, navDots[index]); // Show video and select the corresponding dot on hover
        });

        video.addEventListener('mouseleave', () => {
          this.resetVideos();
        });

        video.addEventListener('click', () => {
          this.showVideo(video, navDots[index]);
        });
      });
    }
  }


  showVideo(video: HTMLElement, dot: HTMLElement) {
    const videoElements = this.el.nativeElement.querySelectorAll('.portfolio-video');
    const navDots = this.el.nativeElement.querySelectorAll('.nav-dot');

    // Hide all videos and remove active class from all dots
    videoElements.forEach((vid: HTMLVideoElement) => {
      this.renderer.removeClass(vid, 'active');
      vid.pause(); // Pause all videos
    });

    navDots.forEach((d: HTMLElement) => this.renderer.removeClass(d, 'active'));

    // Show the selected video and add active class to the clicked dot
    this.renderer.addClass(video, 'active');
    this.renderer.addClass(dot, 'active');

    // Apply zoom effect to the selected video
    this.centerVideo(video);
    // Play the selected video
    (video as HTMLVideoElement).play(); // Ensure the selected video plays
  }




  centerVideo(video: HTMLElement) {
    const container = this.el.nativeElement.querySelector('.portfolio-section-video-webM');
    const containerOuter = this.el.nativeElement.querySelector('.portfolio-section-video-container');

    const videos = container.querySelectorAll('.portfolio-video');
    const containerRect = container.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    const offset = (containerRect.width / 2) - (videoRect.width / 2) - videoRect.left;

    videos.forEach((vid: HTMLElement) => {
      if (vid === video) {
        // this.renderer.setStyle(containerOuter,  'animation', 'scroll 20s linear infinite');
        this.renderer.setStyle(vid, 'transform', `scale(1.2)`);
        this.renderer.setStyle(vid, 'z-index', '1');
      } else {
        const currentIndex = Array.from(videos).indexOf(vid);
        const scale = currentIndex === 0 ? 0.6 : 0.8;
        const xOffset = currentIndex === 0 ? '10px' : '0'; // Adjust the x-offset as needed
        currentIndex === 1
        this.renderer.setStyle(vid, 'transform', `translateX(${xOffset}) scale(${scale})`);
        this.renderer.setStyle(vid, 'z-index', '0');

      }
    });
  }

  resetVideos() {
    const container = this.el.nativeElement.querySelector('.portfolio-section-video-webM');
    const videos = container.querySelectorAll('.portfolio-video');

    videos.forEach((vid: HTMLElement) => {
      this.renderer.setStyle(vid, 'transform', 'scale(1)');
      this.renderer.setStyle(vid, 'z-index', '0');
    });
  }
}
