function normalizeImage(image) {
  if (!image) return null;
  return image.includes("/")
    ? image.slice(image.lastIndexOf("/") + 1)
    : image;
}

function extractImages(groups) {
  const set = new Set();

  for (const group of groups) {
    for (const card of group.cards ?? []) {
      if (card.image) {
        set.add(normalizeImage(card.image));
      }

      if (Array.isArray(card.variants)) {
        for (const v of card.variants) {
          if (v.image) {
            set.add(normalizeImage(v.image));
          }
        }
      }
    }
  }

  return [...set];
}

function initRatings(images) {
  const stored = JSON.parse(localStorage.getItem("ratings") || "{}");
  const ratings = {};

  for (const img of images) {
    ratings[img] = stored[img] ?? { rating: 1000, games: 0 };
  }

  return ratings;
}

function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function vote(winnerImg, loserImg, ratings, k = 32) {
  const w = ratings[winnerImg];
  const l = ratings[loserImg];

  const expectedW = expectedScore(w.rating, l.rating);

  w.rating += k * (1 - expectedW);
  l.rating += k * (0 - (1 - expectedW));

  w.games++;
  l.games++;

  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function pickPair(images, ratings) {
  const sorted = [...images].sort(
    (a, b) => ratings[a].rating - ratings[b].rating
  );

  const i = Math.floor(Math.random() * (sorted.length - 1));
  return [sorted[i], sorted[i + 1]];
}

function getRanking(images, ratings) {
  return [...images].sort(
    (a, b) => ratings[b].rating - ratings[a].rating
  );
}
