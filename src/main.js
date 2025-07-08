// Main JavaScript file for the application
import './styles.css';

// Add any JavaScript functionality here
document.addEventListener('DOMContentLoaded', () => {
  console.log('Site loaded successfully!');

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  
  const lightboxContent = document.createElement('div');
  lightboxContent.className = 'lightbox-content';
  
  const lightboxImg = document.createElement('img');
  lightboxImg.setAttribute('alt', '');
  lightboxContent.appendChild(lightboxImg);
  
  // Create caption element
  const captionEl = document.createElement('div');
  captionEl.className = 'lightbox-caption';
  
  // Create counter element
  const counterEl = document.createElement('div');
  counterEl.className = 'lightbox-counter';
  
  // Create loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'lightbox-loading';
  loadingIndicator.innerHTML = '<div class="spinner"></div>';
  
  // Create zoom controls
  const zoomControls = document.createElement('div');
  zoomControls.className = 'lightbox-zoom';
  
  const zoomInBtn = document.createElement('button');
  zoomInBtn.innerHTML = '+';
  zoomInBtn.setAttribute('aria-label', 'Zoom in');
  
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.innerHTML = '-';
  zoomOutBtn.setAttribute('aria-label', 'Zoom out');
  
  const resetZoomBtn = document.createElement('button');
  resetZoomBtn.innerHTML = '&#8634;';
  resetZoomBtn.setAttribute('aria-label', 'Reset zoom');
  
  zoomControls.appendChild(zoomInBtn);
  zoomControls.appendChild(zoomOutBtn);
  zoomControls.appendChild(resetZoomBtn);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  
  const navDiv = document.createElement('div');
  navDiv.className = 'lightbox-nav';
  
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '&#10094;';
  prevBtn.setAttribute('aria-label', 'Previous image');
  
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '&#10095;';
  nextBtn.setAttribute('aria-label', 'Next image');
  
  navDiv.appendChild(prevBtn);
  navDiv.appendChild(nextBtn);
  
  lightboxContent.appendChild(captionEl);
  lightbox.appendChild(lightboxContent);
  lightbox.appendChild(counterEl);
  lightbox.appendChild(loadingIndicator);
  lightbox.appendChild(zoomControls);
  lightbox.appendChild(closeBtn);
  lightbox.appendChild(navDiv);
  
  document.body.appendChild(lightbox);
  
  // Gallery variables
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX, startY, initialTranslateX, initialTranslateY;
  
  // Preload adjacent images
  function preloadAdjacentImages(currentIdx) {
    const totalImages = galleryItems.length;
    const prevIdx = (currentIdx - 1 + totalImages) % totalImages;
    const nextIdx = (currentIdx + 1) % totalImages;
    
    // Preload previous image
    const prevImg = new Image();
    prevImg.src = galleryItems[prevIdx].getAttribute('data-src');
    
    // Preload next image
    const nextImg = new Image();
    nextImg.src = galleryItems[nextIdx].getAttribute('data-src');
  }
  
  // Add click event to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      const imgSrc = item.getAttribute('data-src');
      const imgAlt = item.querySelector('img').getAttribute('alt');
      openLightbox(imgSrc, imgAlt);
    });
  });
  
  // Open lightbox function
  function openLightbox(src, alt) {
    // Reset zoom and position
    resetZoom();
    
    // Show loading indicator
    loadingIndicator.classList.add('active');
    
    // Set image source and alt text
    lightboxImg.src = src;
    lightboxImg.setAttribute('alt', alt || '');
    
    // Wait for image to load
    lightboxImg.onload = function() {
      loadingIndicator.classList.remove('active');
      lightbox.classList.add('active');
      lightbox.classList.add('zoom-in');
      
      // Remove zoom-in class after animation completes
      setTimeout(() => {
        lightbox.classList.remove('zoom-in');
      }, 500);
      
      // Update counter
      updateCounter();
      
      // Set caption from alt text
      captionEl.textContent = alt || '';
      
      // Preload adjacent images
      preloadAdjacentImages(currentIndex);
      
      // Set focus on the lightbox for keyboard navigation
      lightbox.focus();
    };
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
  }
  
  // Update counter function
  function updateCounter() {
    counterEl.textContent = `${currentIndex + 1}/${galleryItems.length}`;
  }
  
  // Close lightbox function
  function closeLightbox() {
    lightbox.classList.add('zoom-out');
    
    // Wait for zoom animation to complete
    setTimeout(() => {
      lightbox.classList.remove('active');
      lightbox.classList.remove('zoom-out');
      
      // Re-enable scrolling
      document.body.style.overflow = '';
      
      // Reset zoom
      resetZoom();
    }, 300);
  }
  
  // Navigate to previous image
  function showPrevImage() {
    // Add slide-out-right class
    lightboxContent.classList.add('slide-out-right');
    
    // Show loading indicator
    loadingIndicator.classList.add('active');
    
    setTimeout(() => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      const prevSrc = galleryItems[currentIndex].getAttribute('data-src');
      const prevAlt = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
      
      // Reset zoom
      resetZoom();
      
      lightboxImg.src = prevSrc;
      lightboxImg.setAttribute('alt', prevAlt || '');
      
      // Wait for image to load
      lightboxImg.onload = function() {
        loadingIndicator.classList.remove('active');
        
        // Update counter
        updateCounter();
        
        // Set caption from alt text
        captionEl.textContent = prevAlt || '';
        
        // Remove slide-out class and add slide-in class
        lightboxContent.classList.remove('slide-out-right');
        lightboxContent.classList.add('slide-in-left');
        
        // Remove slide-in class after animation completes
        setTimeout(() => {
          lightboxContent.classList.remove('slide-in-left');
        }, 300);
        
        // Preload adjacent images
        preloadAdjacentImages(currentIndex);
      };
    }, 300);
  }
  
  // Navigate to next image
  function showNextImage() {
    // Add slide-out-left class
    lightboxContent.classList.add('slide-out-left');
    
    // Show loading indicator
    loadingIndicator.classList.add('active');
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      const nextSrc = galleryItems[currentIndex].getAttribute('data-src');
      const nextAlt = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
      
      // Reset zoom
      resetZoom();
      
      lightboxImg.src = nextSrc;
      lightboxImg.setAttribute('alt', nextAlt || '');
      
      // Wait for image to load
      lightboxImg.onload = function() {
        loadingIndicator.classList.remove('active');
        
        // Update counter
        updateCounter();
        
        // Set caption from alt text
        captionEl.textContent = nextAlt || '';
        
        // Remove slide-out class and add slide-in class
        lightboxContent.classList.remove('slide-out-left');
        lightboxContent.classList.add('slide-in-right');
        
        // Remove slide-in class after animation completes
        setTimeout(() => {
          lightboxContent.classList.remove('slide-in-right');
        }, 300);
        
        // Preload adjacent images
        preloadAdjacentImages(currentIndex);
      };
    }, 300);
  }
  
  // Zoom functions
  function zoomIn() {
    scale += 0.2;
    updateTransform();
  }
  
  function zoomOut() {
    scale = Math.max(0.5, scale - 0.2);
    updateTransform();
  }
  
  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }
  
  function updateTransform() {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }
  
  // Pan functions
  function startDrag(e) {
    if (scale <= 1) return;
    
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;
    initialTranslateX = translateX;
    initialTranslateY = translateY;
    
    lightboxContent.style.cursor = 'grabbing';
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    const x = e.clientX || (e.touches ? e.touches[0].clientX : startX);
    const y = e.clientY || (e.touches ? e.touches[0].clientY : startY);
    
    translateX = initialTranslateX + (x - startX);
    translateY = initialTranslateY + (y - startY);
    
    updateTransform();
    
    e.preventDefault();
  }
  
  function endDrag() {
    isDragging = false;
    lightboxContent.style.cursor = 'grab';
  }
  
  // Swipe detection
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }
  
  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }
  
  function handleTouchEnd() {
    const swipeThreshold = 100;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left
      showNextImage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right
      showPrevImage();
    }
  }
  
  // Event listeners for lightbox controls
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  
  // Zoom control event listeners
  zoomInBtn.addEventListener('click', zoomIn);
  zoomOutBtn.addEventListener('click', zoomOut);
  resetZoomBtn.addEventListener('click', resetZoom);
  
  // Pan event listeners
  lightboxImg.addEventListener('mousedown', startDrag);
  lightboxImg.addEventListener('touchstart', startDrag, { passive: false });
  
  window.addEventListener('mousemove', drag);
  window.addEventListener('touchmove', drag, { passive: false });
  
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
  
  // Swipe event listeners
  lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
  lightbox.addEventListener('touchmove', handleTouchMove, { passive: true });
  lightbox.addEventListener('touchend', handleTouchEnd);
  
  // Close on click outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === '+') {
      zoomIn();
    } else if (e.key === '-') {
      zoomOut();
    } else if (e.key === '0') {
      resetZoom();
    }
  });
  
  // Form submission handling
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! This is a demo form.');
      contactForm.reset();
    });
  }
});
