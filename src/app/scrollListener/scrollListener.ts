import {Component, HostListener, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'oajsdoaiwndonwaojsodaowjdoijx2',
  template: '',
  styles: [''],
})
export class scrollListener {
  scrolled: boolean = false;
  scrollElem: ElementRef;

  constructor(elementRef: ElementRef) {
    this.scrollElem = elementRef;
  }

  //@ViewChild('div', {static: false}) scrollElem!: ElementRef;

  @HostListener('window:scroll', [])
  onScroll() {
    const st = document.documentElement.scrollTop;
    const h = window.innerHeight;
    const sh = document.documentElement.scrollHeight;

    const dis = sh - h - st;
    const gap = 150;
    const rat = (gap - dis) / gap;

    const p = 0.8;

    let cur = rat < 0 ? st + h * p : st + h * p + rat * h * (1 - p);
    cur = Math.max(cur, h);

    const animOff = st + h + 10;

    const isScrolled = this.scrolled;
    const e = this.scrollElem.nativeElement;

    if (!isScrolled && e.offsetTop < cur) this.scrolled = true;
    else if (isScrolled && e.offsetTop > animOff) this.scrolled = false;

    this.log();
  }

  log(): void {
    console.log('scroll', this.scrolled);
  }
}
