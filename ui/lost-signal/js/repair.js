/* ========================================
   LOST SIGNAL — Phase 2: Image Repair
   ======================================== */

class ImageRepair {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.grid = container.querySelector('.puzzle-grid');
    this.source = container.querySelector('.puzzle-source');
    this.progressFill = container.querySelector('.repair-progress__fill');
    this.progressCount = container.querySelector('.repair-progress__count');
    this.continueBtn = container.querySelector('.btn-continue');

    this.gridSize = 4;
    this.totalPieces = this.gridSize * this.gridSize;
    this.placedCount = 0;
    this.pieces = [];
    this.cells = [];
    this.draggedPiece = null;

    this.init();
  }

  init() {
    this.createGrid();
    this.createPieces();
    this.setupDragAndDrop();

    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        window.audioEngine?.beep(800, 0.1);
        window.glitchEngine?.burst(300);
        setTimeout(() => this.onComplete(), 400);
      });
    }
  }

  // Generate procedural image colors for puzzle
  getColor(row, col) {
    const hue = (row * 30 + col * 60 + 180) % 360;
    const sat = 60 + (row + col) * 5;
    const light = 20 + row * 8 + col * 4;
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  getGradient(row, col) {
    const c1 = this.getColor(row, col);
    const c2 = this.getColor((row + 1) % 4, (col + 1) % 4);
    return `linear-gradient(${135 + row * 45}deg, ${c1}, ${c2})`;
  }

  createGrid() {
    this.grid.innerHTML = '';
    for (let i = 0; i < this.totalPieces; i++) {
      const cell = document.createElement('div');
      cell.className = 'puzzle-cell';
      cell.dataset.index = i;
      const row = Math.floor(i / this.gridSize);
      const col = i % this.gridSize;
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.textContent = `${String(row).padStart(2, '0')}:${String(col).padStart(2, '0')}`;
      this.grid.appendChild(cell);
      this.cells.push(cell);
    }
  }

  createPieces() {
    this.source.innerHTML = '';
    // Create title element
    const title = document.createElement('div');
    title.style.cssText = 'grid-column: 1 / -1; font-size: 0.625rem; color: var(--col-text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.25rem;';
    title.textContent = 'CORRUPTED FRAGMENTS';
    this.source.appendChild(title);

    // Create scrambled order
    const indices = Array.from({ length: this.totalPieces }, (_, i) => i);
    this.shuffle(indices);

    indices.forEach(originalIndex => {
      const row = Math.floor(originalIndex / this.gridSize);
      const col = originalIndex % this.gridSize;

      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.dataset.originalIndex = originalIndex;
      piece.dataset.row = row;
      piece.dataset.col = col;
      piece.draggable = true;
      piece.style.background = this.getGradient(row, col);
      
      // Add small label
      const label = document.createElement('span');
      label.style.cssText = 'position:absolute;bottom:2px;right:3px;font-size:8px;color:rgba(255,255,255,0.4);pointer-events:none;font-family:var(--font-mono);';
      label.textContent = `#${String(originalIndex).padStart(2, '0')}`;
      piece.appendChild(label);

      this.source.appendChild(piece);
      this.pieces.push(piece);
    });
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  setupDragAndDrop() {
    // Piece drag start
    this.source.addEventListener('dragstart', (e) => {
      const piece = e.target.closest('.puzzle-piece');
      if (!piece) return;
      this.draggedPiece = piece;
      piece.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', piece.dataset.originalIndex);
    });

    this.source.addEventListener('dragend', (e) => {
      const piece = e.target.closest('.puzzle-piece');
      if (piece) piece.classList.remove('dragging');
      this.draggedPiece = null;
      this.cells.forEach(c => c.classList.remove('highlight'));
    });

    // Grid drop zones
    this.grid.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const cell = e.target.closest('.puzzle-cell');
      if (cell && !cell.classList.contains('filled')) {
        cell.classList.add('highlight');
      }
    });

    this.grid.addEventListener('dragleave', (e) => {
      const cell = e.target.closest('.puzzle-cell');
      if (cell) cell.classList.remove('highlight');
    });

    this.grid.addEventListener('drop', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.puzzle-cell');
      if (!cell || cell.classList.contains('filled')) return;
      
      const pieceIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const cellIndex = parseInt(cell.dataset.index);

      cell.classList.remove('highlight');

      if (pieceIndex === cellIndex) {
        // Correct placement!
        this.placePiece(cell, pieceIndex);
      } else {
        // Wrong placement — glitch feedback
        window.audioEngine?.beep(200, 0.1, 'sawtooth');
        cell.style.borderColor = 'var(--col-neon-red)';
        cell.style.boxShadow = '0 0 10px rgba(255,0,64,0.3)';
        setTimeout(() => {
          cell.style.borderColor = '';
          cell.style.boxShadow = '';
        }, 500);
      }
    });

    // Touch support
    this.setupTouchDrag();
  }

  setupTouchDrag() {
    let touchPiece = null;
    let ghostEl = null;

    this.source.addEventListener('touchstart', (e) => {
      const piece = e.target.closest('.puzzle-piece');
      if (!piece || piece.classList.contains('placed')) return;
      touchPiece = piece;
      piece.classList.add('dragging');

      // Create ghost element
      ghostEl = piece.cloneNode(true);
      ghostEl.style.cssText = `
        position: fixed;
        width: ${piece.offsetWidth}px;
        height: ${piece.offsetHeight}px;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.8;
        transform: scale(1.1);
      `;
      document.body.appendChild(ghostEl);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!touchPiece || !ghostEl) return;
      const touch = e.touches[0];
      ghostEl.style.left = (touch.clientX - ghostEl.offsetWidth / 2) + 'px';
      ghostEl.style.top = (touch.clientY - ghostEl.offsetHeight / 2) + 'px';

      // Highlight cells
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      this.cells.forEach(c => c.classList.remove('highlight'));
      if (elem) {
        const cell = elem.closest('.puzzle-cell');
        if (cell && !cell.classList.contains('filled')) {
          cell.classList.add('highlight');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!touchPiece) return;
      touchPiece.classList.remove('dragging');

      if (ghostEl) {
        // Check drop target
        const touch = e.changedTouches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem) {
          const cell = elem.closest('.puzzle-cell');
          if (cell && !cell.classList.contains('filled')) {
            const pieceIndex = parseInt(touchPiece.dataset.originalIndex);
            const cellIndex = parseInt(cell.dataset.index);
            
            if (pieceIndex === cellIndex) {
              this.placePiece(cell, pieceIndex);
              touchPiece.classList.add('placed');
            } else {
              window.audioEngine?.beep(200, 0.1, 'sawtooth');
            }
          }
        }
        ghostEl.remove();
        ghostEl = null;
      }

      this.cells.forEach(c => c.classList.remove('highlight'));
      touchPiece = null;
    });
  }

  placePiece(cell, pieceIndex) {
    const row = Math.floor(pieceIndex / this.gridSize);
    const col = pieceIndex % this.gridSize;

    cell.classList.add('filled');
    cell.style.background = this.getGradient(row, col);
    cell.textContent = '';

    // Hide source piece
    const piece = this.source.querySelector(`[data-original-index="${pieceIndex}"]`);
    if (piece) piece.classList.add('placed');

    this.placedCount++;
    window.audioEngine?.beep(600 + this.placedCount * 40, 0.08);

    // Update progress
    const pct = (this.placedCount / this.totalPieces) * 100;
    if (this.progressFill) this.progressFill.style.width = pct + '%';
    if (this.progressCount) this.progressCount.textContent = `${this.placedCount}/${this.totalPieces}`;

    // Update app state
    window.app?.updateIntegrity(20 + Math.round(pct * 0.25));
    window.app?.updateSignalStrength(Math.round(33 + pct * 0.17));

    // Reduce glitch as pieces are placed
    window.glitchEngine?.setIntensity(0.6 - (pct / 100) * 0.2);

    // Check completion
    if (this.placedCount >= this.totalPieces) {
      setTimeout(() => this.onRepairComplete(), 600);
    }
  }

  onRepairComplete() {
    window.audioEngine?.successChime();
    
    // Flash effect
    const flash = document.querySelector('.repair-complete-flash');
    if (flash) {
      flash.classList.add('flash');
      setTimeout(() => flash.classList.remove('flash'), 800);
    }

    // Show continue
    if (this.continueBtn) {
      setTimeout(() => this.continueBtn.classList.add('visible'), 500);
    }
  }
}

window.ImageRepair = ImageRepair;
