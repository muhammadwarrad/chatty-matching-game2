import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css';

const levelConfigs = [
  {
    level: 1,
    pairs: 4,
    triesAllowed: 15,
    quote: "'Focus on building great products and everything else follows.'",
    cardImages: [
      'cards/img1.png', 'cards/img1.png',
      'cards/img2.png', 'cards/img2.png',
      'cards/img3.png', 'cards/img3.png',
      'cards/img4.png', 'cards/img4.png'
    ]
  },
  {
    level: 2,
    pairs: 6,
    triesAllowed: 12,
    quote: "'The only way to survive is to have real, differentiated technology.'",
    cardImages: [
      'cards/img5.png', 'cards/img5.png',
      'cards/img6.png', 'cards/img6.png',
      'cards/img7.png', 'cards/img7.png',
      'cards/img8.png', 'cards/img8.png',
      'cards/img9.png', 'cards/img9.png',
      'cards/img10.png', 'cards/img10.png'
    ]
  },
  {
    level: 3,
    pairs: 8,
    triesAllowed: 10,
    quote: "'If you want to make progress, keep an open mind to new ideas.'",
    cardImages: [
      'cards/img11.png', 'cards/img11.png',
      'cards/img12.png', 'cards/img12.png',
      'cards/img13.png', 'cards/img13.png',
      'cards/img14.png', 'cards/img14.png',
      'cards/img15.png', 'cards/img15.png',
      'cards/img16.png', 'cards/img16.png',
      'cards/img17.png', 'cards/img17.png',
      'cards/img18.png', 'cards/img18.png'
    ]
  },
  {
    level: 4,
    pairs: 10,
    triesAllowed: 8,
    quote: "'The best way to get funding is to build something people love.'",
    cardImages: [
      'cards/img19.png', 'cards/img19.png',
      'cards/img20.png', 'cards/img20.png',
      'cards/img21.png', 'cards/img21.png',
      'cards/img22.png', 'cards/img22.png',
      'cards/img23.png', 'cards/img23.png',
      'cards/img24.png', 'cards/img24.png',
      'cards/img25.png', 'cards/img25.png',
      'cards/img26.png', 'cards/img26.png',
      'cards/img27.png', 'cards/img27.png',
      'cards/img28.png', 'cards/img28.png'
    ]
  },
  {
    level: 5,
    pairs: 12,
    triesAllowed: 6,
    quote: "Sam Altman: 'Ideas are cheap; execution is everything.'",
    cardImages: [
      'cards/img29.png', 'cards/img29.png',
      'cards/img30.png', 'cards/img30.png',
      'cards/img31.png', 'cards/img31.png',
      'cards/img32.png', 'cards/img32.png',
      'cards/img33.png', 'cards/img33.png',
      'cards/img34.png', 'cards/img34.png',
      'cards/img35.png', 'cards/img35.png',
      'cards/img36.png', 'cards/img36.png',
      'cards/img37.png', 'cards/img37.png',
      'cards/img38.png', 'cards/img38.png',
      'cards/img39.png', 'cards/img39.png',
      'cards/img40.png', 'cards/img40.png'
    ]
  }
];

const gridLayouts = {
  1: { cols: 4, rows: 2 }, 
  2: { cols: 4, rows: 3 }, 
  3: { cols: 4, rows: 4 }, 
  4: { cols: 5, rows: 4 }, 
  5: { cols: 6, rows: 4 }  
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Modal({ quote, onNextLevel, isLastLevel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <strong>Sam Altman Quote:</strong>
        <p>{quote}</p>
        {!isLastLevel ? (
          <button onClick={onNextLevel}>Next Level</button>
        ) : (
          <div className="congrats-message">You finished all levels! Congratulations!</div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [triesLeft, setTriesLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalQuote, setModalQuote] = useState("");
  const [cardSize, setCardSize] = useState(0);

  const headerRef = useRef(null);
  const statusRef = useRef(null);
  const restartRef = useRef(null);
  const gridRef = useRef(null);

  const config = levelConfigs.find((l) => l.level === currentLevel);
  const totalPairs = config?.pairs ?? 0;
  const { cols, rows } = gridLayouts[currentLevel] || { cols: 4, rows: 2 };
  const isLastLevel = currentLevel === levelConfigs.length;

  useEffect(() => {
    startLevel(currentLevel);
  }, [currentLevel]);

  function startLevel(level) {
    const config = levelConfigs.find((l) => l.level === level);
    if (!config) return;
    const shuffled = shuffleArray(config.cardImages);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setTriesLeft(config.triesAllowed);
    setMessage(`Level ${level}: Match all pairs!`);
    setShowModal(false);
  }

  function handleCardClick(index) {
    if (matchedCards.includes(index) || flippedCards.includes(index)) return;
    if (flippedCards.length === 2) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => checkForMatch(newFlipped), 700);
    }
  }

  function checkForMatch([firstIndex, secondIndex]) {
    const isMatch = cards[firstIndex] === cards[secondIndex];
    if (isMatch) {
      setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
      setMessage("Nice match!");
    } else {
      setMessage("Not a match, try again!");
      setTriesLeft((prev) => prev - 1);
    }
    setFlippedCards([]);
  }

  useEffect(() => {
    if (!config) return;
    const totalCards = config.cardImages.length;
    if (matchedCards.length === totalCards) {
      setModalQuote(config.quote);
      setShowModal(true);
      setMessage("Level completed!");
    }

    if (triesLeft === 0 && matchedCards.length < totalCards) {
      setMessage("Out of tries! Restart level.");
    }
  }, [matchedCards, triesLeft, currentLevel, cards, config]);

  function nextLevel() {
    setShowModal(false);
    if (currentLevel < levelConfigs.length) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setMessage("You've completed all levels! Congratulations!");
    }
  }

  function restartLevel() {
    startLevel(currentLevel);
  }

  useLayoutEffect(() => {
    function updateCardSize() {
      if (!headerRef.current || !statusRef.current || !gridRef.current) return;
      
      const headerHeight = headerRef.current.offsetHeight || 0;
      const statusHeight = statusRef.current.offsetHeight || 0;
      const restartHeight = restartRef.current?.offsetHeight || 0;

      const overhead = headerHeight + statusHeight + restartHeight + 10;
      const availableWidth = window.innerWidth - 20;
      const availableHeight = window.innerHeight - overhead - 20;

      const sizeBasedOnWidth = availableWidth / cols;
      const sizeBasedOnHeight = availableHeight / rows;
      const newCardSize = Math.floor(Math.min(sizeBasedOnWidth, sizeBasedOnHeight));

      setCardSize(newCardSize);
    }

    updateCardSize();
    window.addEventListener('resize', updateCardSize);
    return () => window.removeEventListener('resize', updateCardSize);
  }, [cols, rows, triesLeft, matchedCards.length, totalPairs]);

  return (
    <div className="app-container">
      <header className="game-header" ref={headerRef}>
        <h1>Chatty Matching Game</h1>
      </header>

      <div className="status-bar" ref={statusRef}>
        <div className="message">{message}</div>
        {triesLeft > 0 && matchedCards.length < totalPairs * 2 && (
          <div className="tries">Tries left: {triesLeft}</div>
        )}
      </div>

      {triesLeft === 0 && matchedCards.length < totalPairs * 2 && (
        <div className="restart-container" ref={restartRef}>
          <button onClick={restartLevel}>Restart Level</button>
        </div>
      )}

      {cards.length > 0 && (
        <div 
          className="grid"
          ref={gridRef}
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cardSize}px)`
          }}
        >
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            return (
              <div 
                key={index} 
                className={`card-container ${isFlipped ? 'flipped' : ''}`}
                style={{ width: cardSize, height: cardSize }}
                onClick={() => {
                  if (triesLeft > 0 && matchedCards.length < totalPairs * 2 && !showModal) {
                    handleCardClick(index);
                  }
                }}
              >
                <div className="card-inner">
                  <div className="card-face card-back">
                    <img src="cards/back.png" alt="Back" />
                  </div>
                  <div className="card-face card-front">
                    <img src={card} alt="Card" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal 
          quote={modalQuote}
          onNextLevel={nextLevel}
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  );
}

export default App;
