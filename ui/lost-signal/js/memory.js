/* ========================================
   LOST SIGNAL — Phase 4: Memory Reconstruction
   ======================================== */

class MemoryReconstruction {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.slotsContainer = container.querySelector('.timeline__slots');
    this.fragmentsContainer = container.querySelector('.memory-fragments');
    this.lineFill = container.querySelector('.timeline__line-fill');
    this.continueBtn = container.querySelector('.btn-continue');

    // Memory data (must be arranged in order)
    this.memories = [
      { id: 0, time: '00:00:12', text: 'Một tín hiệu yếu ớt vang lên từ khoảng trống...', hint: 'Khởi đầu của mọi thứ' },
      { id: 1, time: '00:01:47', text: 'Hình ảnh mờ dần hiện ra — một căn phòng tối, ánh sáng xanh nhấp nháy.', hint: 'Không gian đầu tiên' },
      { id: 2, time: '00:03:24', text: 'Giọng nói vọng lại: "Bạn có nghe thấy tôi không?"', hint: 'Liên lạc đầu tiên' },
      { id: 3, time: '00:05:08', text: 'Dữ liệu bắt đầu tái cấu trúc — mọi mảnh ghép đang hội tụ.', hint: 'Điểm chuyển biến' },
      { id: 4, time: '00:07:33', text: 'Bức tranh hoàn chỉnh — tín hiệu này... chính là thông điệp gửi đến bạn.', hint: 'Kết thúc & tiết lộ' },
    ];

    this.shuffledMemories = [];
    this.placedSlots = new Array(this.memories.length).fill(null);
    this.placedCount = 0;
    this.draggedCard = null;

    this.init();
  }

  init() {
    this.createSlots();
    this.createCards();
    this.setupDragAndDrop();

    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        window.audioEngine?.beep(800, 0.1);
        window.glitchEngine?.burst(300);
        setTimeout(() => this.onComplete(), 400);
      });
    }
  }

  createSlots() {
    this.slotsContainer.innerHTML = '';
    this.memories.forEach((mem, i) => {
      const slot = document.createElement('div');
      slot.className = 'timeline-slot';
      slot.innerHTML = `
        <div class="timeline-slot__time">${mem.time}</div>
        <div class="timeline-slot__marker" data-slot="${i}"></div>
        <div class="timeline-slot__drop" data-slot="${i}">
          <span class="placeholder-text">Kéo ký ức vào đây</span>
        </div>
      `;
      this.slotsContainer.appendChild(slot);
    });
  }

  createCards() {
    // Shuffle
    this.shuffledMemories = [...this.memories].sort(() => Math.random() - 0.5);

    // Create title
    const title = document.createElement('div');
    title.style.cssText = 'width: 100%; font-size: 0.625rem; color: var(--col-text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; text-align: center;';
    title.textContent = '◆ KÝ ỨC BỊ ĐẢO LỘN';
    this.fragmentsContainer.innerHTML = '';
    this.fragmentsContainer.appendChild(title);

    this.shuffledMemories.forEach(mem => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.draggable = true;
      card.dataset.memoryId = mem.id;
      card.innerHTML = `
        <div class="memory-card__timestamp">${mem.time}</div>
        <div class="memory-card__text">${mem.text}</div>
        <div class="memory-card__hint">${mem.hint}</div>
      `;
      this.fragmentsContainer.appendChild(card);
    });
  }

  setupDragAndDrop() {
    // Drag start
    this.fragmentsContainer.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.memory-card');
      if (!card || card.classList.contains('placed')) return;
      this.draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.memoryId);
    });

    this.fragmentsContainer.addEventListener('dragend', (e) => {
      const card = e.target.closest('.memory-card');
      if (card) card.classList.remove('dragging');
      this.draggedCard = null;
      this.clearHighlights();
    });

    // Drop zones
    this.slotsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const drop = e.target.closest('.timeline-slot__drop');
      if (drop && !drop.classList.contains('filled')) {
        drop.classList.add('highlight');
      }
    });

    this.slotsContainer.addEventListener('dragleave', (e) => {
      const drop = e.target.closest('.timeline-slot__drop');
      if (drop) drop.classList.remove('highlight');
    });

    this.slotsContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      const drop = e.target.closest('.timeline-slot__drop');
      if (!drop || drop.classList.contains('filled')) return;

      const memId = parseInt(e.dataTransfer.getData('text/plain'));
      const slotIndex = parseInt(drop.dataset.slot);

      drop.classList.remove('highlight');

      // Check if correct slot (memory id should match slot index)
      if (memId === slotIndex) {
        this.placeMemory(drop, slotIndex, memId);
      } else {
        // Wrong slot
        window.audioEngine?.beep(200, 0.1, 'sawtooth');
        drop.style.borderColor = 'var(--col-neon-red)';
        setTimeout(() => drop.style.borderColor = '', 500);
      }
    });

    // Touch support
    this.setupTouchDrag();
  }

  setupTouchDrag() {
    let touchCard = null;
    let ghostEl = null;

    this.fragmentsContainer.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.memory-card');
      if (!card || card.classList.contains('placed')) return;
      touchCard = card;
      card.classList.add('dragging');

      ghostEl = card.cloneNode(true);
      ghostEl.style.cssText = `
        position: fixed; width: ${card.offsetWidth}px;
        pointer-events: none; z-index: 1000; opacity: 0.8;
      `;
      document.body.appendChild(ghostEl);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!touchCard || !ghostEl) return;
      const touch = e.touches[0];
      ghostEl.style.left = (touch.clientX - ghostEl.offsetWidth / 2) + 'px';
      ghostEl.style.top = (touch.clientY - ghostEl.offsetHeight / 2) + 'px';

      this.clearHighlights();
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      if (elem) {
        const drop = elem.closest('.timeline-slot__drop');
        if (drop && !drop.classList.contains('filled')) {
          drop.classList.add('highlight');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!touchCard) return;
      touchCard.classList.remove('dragging');

      if (ghostEl) {
        const touch = e.changedTouches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem) {
          const drop = elem.closest('.timeline-slot__drop');
          if (drop && !drop.classList.contains('filled')) {
            const memId = parseInt(touchCard.dataset.memoryId);
            const slotIndex = parseInt(drop.dataset.slot);
            if (memId === slotIndex) {
              this.placeMemory(drop, slotIndex, memId);
              touchCard.classList.add('placed');
            } else {
              window.audioEngine?.beep(200, 0.1, 'sawtooth');
            }
          }
        }
        ghostEl.remove();
        ghostEl = null;
      }
      this.clearHighlights();
      touchCard = null;
    });
  }

  clearHighlights() {
    this.container.querySelectorAll('.timeline-slot__drop.highlight').forEach(
      el => el.classList.remove('highlight')
    );
  }

  placeMemory(dropEl, slotIndex, memId) {
    const mem = this.memories[memId];

    // Fill the slot
    dropEl.classList.add('filled');
    dropEl.innerHTML = `
      <div class="placed-fragment">
        <div class="placed-fragment__time">${mem.time}</div>
        <div class="placed-fragment__text">${mem.text}</div>
      </div>
    `;

    // Mark card as placed
    const card = this.fragmentsContainer.querySelector(`[data-memory-id="${memId}"]`);
    if (card) card.classList.add('placed');

    // Update marker
    const marker = this.slotsContainer.querySelector(`.timeline-slot__marker[data-slot="${slotIndex}"]`);
    if (marker) marker.classList.add('filled');

    this.placedSlots[slotIndex] = memId;
    this.placedCount++;

    window.audioEngine?.beep(600 + this.placedCount * 80, 0.08);

    // Update timeline line fill
    const pct = (this.placedCount / this.memories.length) * 100;
    if (this.lineFill) this.lineFill.style.height = pct + '%';

    // Update app
    window.app?.updateIntegrity(75 + Math.round(pct * 0.2));
    window.app?.updateSignalStrength(80 + Math.round(pct * 0.15));
    window.glitchEngine?.setIntensity(0.15 - (pct / 100) * 0.1);

    // Check completion
    if (this.placedCount >= this.memories.length) {
      setTimeout(() => this.onMemoryComplete(), 1000);
    }
  }

  onMemoryComplete() {
    window.audioEngine?.successChime();
    window.glitchEngine?.transitionTo(0.02, 1500);

    // Show continue
    if (this.continueBtn) {
      setTimeout(() => this.continueBtn.classList.add('visible'), 500);
    }
  }
}

window.MemoryReconstruction = MemoryReconstruction;
