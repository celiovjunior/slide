export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            startX: 0,
            movement: 0,
        }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.5;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let moveType;
        if(event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = 'mousemove';
        } else {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = 'touchend';
        }
        this.wrapper.addEventListener(moveType, this.onMove);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if(this.dist.movement);
        console.log(this.dist.movement)
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onStart);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    // Slides Config
    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return  -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return {
                element,
                position,
            }
        });
        console.log(this.slideArray);
    }

    slidesIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index]
        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide() {
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slidesConfig();

        return this;
    }
}