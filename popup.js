// Offset must be between 1 - 1000
let id = '1';
let currentPokemon;
let currentPokemonAttacks = [];

// Shuffle pokemon id
const shuffleId = () => {
	const newId = String(Math.floor(Math.random() * 1000));
	console.log('New Offset:', newId);
	id = newId;
	console.log('ID:', id);
};

// Fetch new pokemon
const fetchPokemon = async () => {
	shuffleId();
	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
		currentPokemon = await response.json();
		await getMoves();
		setPokemon();
		console.log('Current Pokemon:', currentPokemon);
	} catch (error) {
		alert(error.message);
	}
};

// Set new pokemon details
const setPokemon = () => {
	console.log(currentPokemonAttacks);
	const name = document.getElementById('name');
	const hp = document.getElementById('hp');
	const image = document.getElementById('image');
	const attack1_title = document.getElementById('attack1_title');
	const attack2_title = document.getElementById('attack2_title');
	const attack1_desc = document.getElementById('attack1_desc');
	const attack2_desc = document.getElementById('attack2_desc');
	const attack1_accuracy = document.getElementById('attack1_accuracy');
	const attack2_accuracy = document.getElementById('attack2_accuracy');
	const ability1_value = document.getElementById('ability1_value');
	const ability2_value = document.getElementById('ability2_value');
	const ability3_value = document.getElementById('ability3_value');

	image.setAttribute('src', currentPokemon?.sprites?.front_default);
	hp.textContent = `${currentPokemon?.stats[0]?.base_stat} HP`;
	name.textContent = currentPokemon?.name;

	attack1_title.textContent = currentPokemonAttacks[0]?.name
		?.split('-')
		?.join(' ');
	attack2_title.textContent = currentPokemonAttacks[1]?.name
		?.split('-')
		?.join(' ');
	attack1_desc.textContent = currentPokemonAttacks[0]?.description;
	attack2_desc.textContent = currentPokemonAttacks[1]?.description;
	attack1_accuracy.textContent = currentPokemonAttacks[0]?.accuracy;
	attack2_accuracy.textContent = currentPokemonAttacks[1]?.accuracy;

	ability1_value.textContent = currentPokemon?.stats[1]?.base_stat;
	ability2_value.textContent = currentPokemon?.stats[2]?.base_stat;
	ability3_value.textContent = currentPokemon?.stats[5]?.base_stat;
};

// Select 2 random moves from pokemon
const getMoves = async () => {
	const totalMoves = currentPokemon?.moves?.length;

	// Setup move objects
	let move1 = {
		name: '',
		description: '',
		url: '',
	};
	let move2 = {
		name: '',
		description: '',
		url: '',
	};

	// Select 2 random moves from moves list
	const randomMove1 =
		currentPokemon?.moves[Math.floor(Math.random() * totalMoves) - 1];
	const randomMove2 =
		currentPokemon?.moves[Math.floor(Math.random() * totalMoves) - 1];
	console.log('MOVE 1', randomMove1);
	console.log('MOVE 2', randomMove2);

	// Set move names & urls in move objects
	move1 = {
		...move1,
		accuracy: null,
		name: randomMove1?.move?.name,
		url: randomMove1?.move?.url,
	};
	move2 = {
		...move2,
		accuracy: null,
		name: randomMove2?.move?.name,
		url: randomMove2?.move?.url,
	};

	// Get move details
	try {
		const move1Response = await fetch(move1.url);
		const move2Response = await fetch(move2.url);
		const move1Data = await move1Response.json();
		const move2Data = await move2Response.json();

		move1 = {
			...move1,
			description: move1Data?.flavor_text_entries.find(
				(entry) => entry.language.name === 'en'
			)?.flavor_text,
			accuracy: move1Data?.accuracy,
		};
		move2 = {
			...move2,
			description: move2Data?.flavor_text_entries.find(
				(entry) => entry.language.name === 'en'
			)?.flavor_text,
			accuracy: move2Data?.accuracy,
		};

		console.log('Move 1 Details: ', move1Data);
		console.log('Move 2 Details: ', move2Data);
	} catch (error) {
		alert(error.message);
		fetchPokemon();
	}

	currentPokemonAttacks = [move1, move2];
	console.log('current pokemon', currentPokemonAttacks);
	console.log('Finished getting moves');
};

fetchPokemon();
