async function displayInspirationalQuote() {
    const response = await fetch("https://api.quotable.io/quotes/random");
    const quote = (await response.json())[0];
    console.log(`${quote.content}\n-- ${quote.author}`);
}

async function displayRandomUserInfo() {
  const response = await fetch("https://randomuser.me/api/");
  const user = (await response.json()).results[0];

  const name = `${user.name.first} ${user.name.last}`;
  const street = user.location.street;
  const city = user.location.city;
  const state = user.location.state;
  const country = user.location.country;
  const postcode = user.location.postcode;
  const mailing_addr = `${street.number} ${street.name}, ${city}, ${state} ${postcode}, ${country}`;

  console.log(`${name}\n${user.email}\n${mailing_addr}`);
}

async function getRickAndMortyCharacter() {
  const randInd = getRandomInt(1, 100);
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${randInd}`
  );
  const character = await response.json();

  console.log(
    `Name: ${character.name}\nStatus: ${character.status}\nOrigin: ${character.origin.name}\nLocation: ${character.location.name}`
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

getRickAndMortyCharacter();
displayRandomUserInfo();
displayInspirationalQuote();
