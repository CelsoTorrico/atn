import { Injectable } from '@angular/core';

/**
 * Lightbox
 */
@Injectable()
export class MediumLightboxService {

  zoomedImg:any;
  isZoomed:any;
  public screenSize:any = {}; 
  scrollbarWidth:any;
  options:any = {
    margin: 50
  };

  /*
  * Código extraído da bibilioteca e convertido em formato Typescript
 * Plugin: MediumLightbox v1.0
 * Author: Davide Calignano
 */
  constructor() {
    
    "use strict";

    let margin   = this.options.margin || 50;
    let element  = "figure.zoom-effect";

    // quit if no root element
    if (!element) return;

    // Get the scrollbar width
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);
    this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);  

    this.screenSize = this.updateScreenSize();

    //recalc size screen on resize
    window.addEventListener("resize", function(ev) {
      //this.updateScreenSize();
    });

    //Apply effect on all elements
    let elements = document.querySelectorAll(element);

    Array.prototype.forEach.call(elements, function (el, i) {
      el.addEventListener("click", this.zoom(this, margin));
    });

    window.addEventListener("scroll", this.zoomOut);

    console.log('carregado');

  }

  zoom(this:any, margin:any) {

    if (!this.isZoomed) {

      //Set status
      this.isZoomed = !this.isZoomed;

      //Get image to be removed on scroll
      this.zoomedImg = this;

      //Get img node
      if (!this.img)
        this.img = this.getElementsByTagName('img')[0];

      //Get img size
      let imgH = this.img.getBoundingClientRect().height;
      let imgW = this.img.getBoundingClientRect().width;
      let imgL = this.img.getBoundingClientRect().left;
      let imgT = this.img.getBoundingClientRect().top;
      let realW, realH;

      //Get real dimension
      if (this.img.dataset) {
        realW = this.img.dataset.width;
        realH = this.img.dataset.height;
      } else {
        realW = this.img.getAttribute('data-width');
        realH = this.img.getAttribute('data-height');
      }

      //add class to img
      if (this.img.classList)
        this.img.classList.add('zoomImg');
      else
        this.img.className += ' ' + 'zoomImg';


      //create overlay div
      this.overlay = document.createElement('div');
      this.overlay.id = 'the-overlay';
      this.overlay.className = 'zoomOverlay';
      this.overlay.style.cssText = 'height:' + (this.screenSize.y) + 'px; width: ' + this.screenSize.x + 'px; top: -' + ((this.screenSize.y - imgH) / 2) + 'px; left: -' + ((this.screenSize.x - imgW) / 2) + 'px;';


      //create wrapper for img and set attributes 
      this.wrapper = document.createElement('div');
      this.wrapper.id = 'the-wrapper';
      this.wrapper.className = 'zoomImg-wrap zoomImg-wrap--absolute';
      // this.wrapper.style.cssText = 'transform: translate(0px, 0px) translateZ(0px);';
      this.wrapper.appendChild(this.img);


      //appen element to body
      this.wrapper.appendChild(this.overlay);
      this.children[0].appendChild(this.wrapper);


      //wrap coordinates
      let wrapX = ((this.screenSize.x - this.scrollbarWidth) / 2) - imgL - (imgW / 2);
      let wrapY = imgT * (-1) + (this.screenSize.y - imgH) / 2;



      //Calc scale
      //TODO if ratio*H > realH no scale
      let scale = 1;
      if (realH > imgH) {
        if (imgH == imgW && this.screenSize.y > this.screenSize.x) {
          // case 1: square image and screen h > w
          scale = (this.screenSize.x - margin) / imgW;
        } else if (imgH == imgW && this.screenSize.y < this.screenSize.x) {
          // case 2: square image and screen w > h
          scale = (this.screenSize.y - margin) / imgH;
        } else if (imgH > imgW) {
          // case 3: rectangular image h > w
          scale = (this.screenSize.y - margin) / imgH;
          if (scale * imgW > this.screenSize.x) {
            // case 3b: rectangular image h > w but zoomed image is too big 
            scale = (this.screenSize.x - margin) / imgW;
          };
        } else if (imgH < imgW) {
          // case 4: rectangular image w > h
          scale = (this.screenSize.x - margin) / imgW;
          if (scale * imgH > this.screenSize.y) {
            // case 4b: rectangular image w > h but zoomed image is too big 
            scale = (this.screenSize.y - margin) / imgH;
          };
        }
      }

      //recal scale if zoomed image is more bigger then original
      if (scale * imgW > realW) {
        scale = realW / imgW;
        //console.log('big')
      }

      //Add zommed values: x,y and scale
      let that = this;
      setTimeout(function () {
        that.wrapper.style.cssText = 'transform: translate(' + wrapX + 'px, ' + wrapY + 'px) translateZ(0px);-webkit-transform: translate(' + wrapX + 'px, ' + wrapY + 'px) translateZ(0px);';
        that.img.style.cssText = "transform: scale(" + scale + ");-webkit-transform: scale(" + scale + ")";
        that.overlay.className = 'zoomOverlay show';
      }, 0);


    } else {
      this.isZoomed = !this.isZoomed;

      //remove from zoomeImg
      this.zoomedImg = null

      //remove style
      this.img.style.cssText = "";
      this.wrapper.style.cssText = '';
      this.overlay.className = 'zoomOverlay';



      //remove element
      let that = this;
      setTimeout(function () {
        that.children[0].appendChild(that.img)
        that.children[0].removeChild(that.wrapper)

        let className = 'zoomImg'
        if (that.img.classList)
          that.img.classList.remove(className);
        else
          that.img.className = that.img.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

      }, 300)
    }
  }

  //Get size screen x and y
  updateScreenSize() {
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    return { x : x, y : y};
  }

  //zoomOut on scroll
  zoomOut() {
    if (this.zoomedImg) {
      this.zoomedImg.click();
    }
  }


}
