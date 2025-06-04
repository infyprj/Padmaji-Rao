import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.6s 0.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.6s 0.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s 0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;

  currentSlide = 0;
  isLoaded = false;

  heroSlides = [
    {
      title: 'Experience Products in 3D',
      subtitle: 'Revolutionary Shopping',
      description: 'Rotate, zoom, and explore every detail of products before you buy',
      image: 'assets/images/hero-slide-1.jpg',
      cta: 'Start Exploring'
    },
    {
      title: 'Interactive Product Visualization',
      subtitle: 'Next-Gen E-commerce',
      description: 'Immerse yourself in a new dimension of online shopping',
      image: 'assets/images/hero-slide-2.jpg',
      cta: 'View Products'
    },
    {
      title: 'Touch. Feel. Buy.',
      subtitle: 'Virtual Reality Shopping',
      description: 'Get closer to products than ever before with our 3D technology',
      image: 'assets/images/hero-slide-3.jpg',
      cta: 'Shop Now'
    }
  ];

  features = [
    {
      icon: 'cube',
      title: '360° Product View',
      description: 'Examine products from every angle with smooth 360-degree rotation',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: 'zoom-in',
      title: 'Ultra HD Zoom',
      description: 'Zoom into intricate details with crystal clear high-definition rendering',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'layers',
      title: 'AR Integration',
      description: 'Place products in your space using augmented reality technology',
      color: 'from-pink-500 to-red-600'
    },
    {
      icon: 'smartphone',
      title: 'Cross-Platform',
      description: 'Seamless experience across desktop, tablet, and mobile devices',
      color: 'from-green-500 to-blue-600'
    }
  ];

  categories = [
    {
      name: 'Electronics',
      count: '2,450+',
      image: 'assets/images/category-electronics.jpg',
      gradient: 'from-blue-600 to-purple-700'
    },
    {
      name: 'Fashion',
      count: '5,280+',
      image: 'assets/images/category-fashion.jpg',
      gradient: 'from-pink-600 to-red-700'
    },
    {
      name: 'Home & Garden',
      count: '3,120+',
      image: 'assets/images/category-home.jpg',
      gradient: 'from-green-600 to-teal-700'
    },
    {
      name: 'Sports',
      count: '1,890+',
      image: 'assets/images/category-sports.jpg',
      gradient: 'from-orange-600 to-yellow-700'
    }
  ];

  testimonials = [
    {
      name: '- Sarah Johnson',
      //role: 'Fashion Designer',
      //avatar: 'assets/images/avatar-1.jpg',
      rating: 5,
      text: 'The 3D visualization completely changed how I shop online. I can see every detail before purchasing!'
    },
    {
      name: '- Mike Chen',
      //role: 'Tech Enthusiast',
      //avatar: 'assets/images/avatar-2.jpg',
      rating: 5,
      text: 'Incredible technology! Being able to rotate and zoom products makes online shopping feel real.'
    },
    {
      name: '- Emma Davis',
      //role: 'Interior Designer',
      //avatar: 'assets/images/avatar-3.jpg',
      rating: 5,
      text: 'The AR feature helps me visualize how furniture looks in my space. Absolutely revolutionary!'
    }
  ];

  stats = [
    { number: '50K+', label: 'Happy Customers', icon: 'users' },
    { number: '25K+', label: '3D Products', icon: 'box' },
    { number: '99.9%', label: 'Uptime', icon: 'activity' },
    { number: '4.9/5', label: 'Rating', icon: 'star' }
  ];

  private slideInterval: any;
  private intersectionObserver!: IntersectionObserver;

  constructor(private router: Router) { }

  ngOnInit() {
    this.startSlideshow();
    this.setupIntersectionObserver();
    setTimeout(() => this.isLoaded = true, 100);
  }

  ngAfterViewInit() {
    if (this.heroVideo) {
      this.heroVideo.nativeElement.play().catch(e => console.log('Video autoplay failed:', e));
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
  }

  onElementVisible(element: HTMLElement) {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }

  scrollToSection(sectionId: string) {
    this.router.navigate(['/products'])
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

