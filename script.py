import codecs

file_path = r'c:\portfolio\index.html'

with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# normalize line endings
text = text.replace('\r\n', '\n')

text = text.replace('<li><a href="#chapter-4" class="nav__link" data-chapter="4">Ch.04</a></li>',
                    '<li><a href="#chapter-4" class="nav__link" data-chapter="4">Ch.04</a></li>\n      <li><a href="#chapter-5" class="nav__link" data-chapter="5">Ch.05</a></li>')

text = text.replace('id="chapter-4" data-chapter="4"', 'id="chapter-5" data-chapter="5"')
text = text.replace('<span class="chapter__number">04</span>', '<span class="chapter__number">05</span>')
text = text.replace('id="chapter-3" data-chapter="3"', 'id="chapter-4" data-chapter="4"')
text = text.replace('<span class="chapter__number">03</span>', '<span class="chapter__number">04</span>')
text = text.replace('id="chapter-2" data-chapter="2"', 'id="chapter-3" data-chapter="3"')
text = text.replace('<span class="chapter__number">02</span>', '<span class="chapter__number">03</span>')
text = text.replace('id="chapter-1" data-chapter="1"', 'id="chapter-2" data-chapter="2"')
text = text.replace('<span class="chapter__number">01</span>', '<span class="chapter__number">02</span>')

text = text.replace('class="section chapter chapter--reverse" id="chapter-5"', 'class="section chapter" id="chapter-5"')
text = text.replace('class="section chapter" id="chapter-4"', 'class="section chapter chapter--reverse" id="chapter-4"')
text = text.replace('class="section chapter chapter--reverse" id="chapter-3"', 'class="section chapter" id="chapter-3"')
text = text.replace('class="section chapter" id="chapter-2"', 'class="section chapter chapter--reverse" id="chapter-2"')

new_ch1 = """  <!-- ============================================ -->
  <!-- SECTION: CHAPTER 01 - PHOTOGRAPHY            -->
  <!-- ============================================ -->
  <section class="section chapter" id="chapter-1" data-chapter="1">
    <div class="chapter__header">
      <span class="chapter__number">01</span>
      <h2 class="chapter__title">Nhiếp Ảnh</h2>
      <span class="chapter__genre">📸 Photography</span>
    </div>
    <div class="chapter__content">
      <div class="polaroid polaroid--tilt-left" style="z-index: 2;">
        <div class="polaroid__image">
          <img src="img/DSC02814.JPG" alt="Nhiếp ảnh" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <p class="polaroid__caption">Khoảnh khắc thanh xuân 📸</p>
      </div>
      <div class="polaroid polaroid--tilt-right" style="position: absolute; right: 5%; top: -10%; transform: scale(0.9) rotate(10deg); z-index: 1;">
        <div class="polaroid__image">
          <img src="img/DSC02814.JPG" alt="Nhiếp ảnh 2" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </div>
      <div class="chapter__info" style="position: relative; z-index: 3;">
        <h3 class="chapter__project-name">Thế Giới Qua Ống Kính</h3>
        <div class="chapter__meta">
          <span class="chapter__year">📅 2026</span>
          <span class="chapter__role">🎬 Photographer</span>
        </div>
        <p class="chapter__synopsis">
          Biến những khoảnh khắc đời thường thành khung hình điện ảnh. Mình thích 
          ghi lại vẻ đẹp của ánh sáng, con người và những câu chuyện không lời.
        </p>
        <div class="chapter__tags">
          <span class="tag">Lightroom</span>
          <span class="tag">Sony A6000</span>
          <span class="tag">Color Grading</span>
          <span class="tag">Street Style</span>
        </div>
        <a href="#" class="chapter__cta">▶ Xem Gallery</a>
      </div>
    </div>
    <div class="chapter__annotation" aria-hidden="true" style="z-index: 10;">
      <span class="annotation-text">đam mê từ bé 🎥</span>
    </div>
  </section>

"""

search_ch1 = """  <!-- ============================================ -->
  <!-- SECTION: CHAPTER 01 - WEB DESIGN             -->"""

if search_ch1 in text:
    text = text.replace(search_ch1, new_ch1 + search_ch1.replace('CHAPTER 01', 'CHAPTER 02'))

new_skill = """      <div class="skill-card" data-skill="photo">
        <div class="skill-card__icon">📸</div>
        <h3 class="skill-card__title">Nhiếp Ảnh</h3>
        <div class="skill-card__bar">
          <div class="skill-card__fill" data-percent="90"></div>
        </div>
        <ul class="skill-card__tools">
          <li>Chụp chân dung</li>
          <li>Chụp sự kiện</li>
          <li>Lightroom</li>
        </ul>
      </div>

"""

text = text.replace('<div class="skills-grid">', '<div class="skills-grid">\n' + new_skill)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(text)

print("SUCCESS")
