const surahListEl = document.getElementById("surah-list");
const contentEl = document.getElementById("surah-content");

function toArabicNumber(number) {
  return number.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}

// Fetch Surah list
async function fetchSurahList() {
  const response = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await response.json();
  return data.data;
}

// Fetch Surah details with Arabic and English text
async function fetchSurahDetails(surahNumber) {
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.asad`);
  const data = await response.json();
  return data.data;
}

// Display Surah list
function displaySurahList(surahs) {
  surahListEl.innerHTML = '';
  surahs.forEach(surah => {
    const li = document.createElement('li');
    li.textContent = `${surah.number}. ${surah.englishName}`;
    li.addEventListener('click', () => loadSurah(surah.number));
    surahListEl.appendChild(li);
  });
}

// Load and show Surah content
async function loadSurah(surahNumber) {
  contentEl.innerHTML = '<p>Loading...</p>';
  const [arabicData, englishData] = await fetchSurahDetails(surahNumber);

  const verses = arabicData.ayahs.map((ayah, index) => {
    return {
      arabicText: ayah.text,
      englishText: englishData.ayahs[index].text
    };
  });

  // Add styling for the Surah name to make it unique
  contentEl.innerHTML = `
    <h2 style="font-size: 30px; color:rgb(41, 39, 114); text-align: center; font-weight: bold; background-color: #f0f8ff; padding: 10px; border-radius: 8px;">
      ${arabicData.englishName}
    </h2>
  `;
  
  verses.forEach(verse => {
    const verseEl = document.createElement('div');
    // Remove any numbers (١, ٢, ٣, etc.) from the Arabic text
    const arabicTextWithoutNumbers = verse.arabicText.replace(/[٠١٢٣٤٥٦٧٨٩]/g, '');
    
    verseEl.innerHTML = `
      <p style="font-size: 22px; line-height: 2; direction: rtl;">${arabicTextWithoutNumbers}</p>
      <p style="color: black; background-color: skyblue; padding: 5px; border-radius: 5px; font-size: 18px;">
        ${verse.englishText}
      </p>
    `;
    contentEl.appendChild(verseEl);
  });
}

// Handle search bar
function handleSearchInput(surahs) {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredSurahs = surahs.filter(surah =>
      surah.englishName.toLowerCase().includes(query) ||
      surah.name.toLowerCase().includes(query)
    );
    displaySurahList(filteredSurahs);
  });
}

// Init app
async function init() {
  const surahs = await fetchSurahList();
  displaySurahList(surahs);
  handleSearchInput(surahs);
}

init();
