// fs.writeFileSync('ipdb.json', JSON.stringify(ipdb.filter(i => i.year > 1960 && i.ipdb.rating).map(i => pick(i, 'ipdb', 'title', 'year')), null, '  '));
const ipdb: { ipdb: { number: number, mfg?: number, rating?: string, mpu?: number }, title: string, year: number }[] = [
	{
		"ipdb": {
			"number": 2,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "Abra Ca Dabra",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 11,
			"mfg": 351,
			"rating": "6.4"
		},
		"title": "Aces & Kings",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 20,
			"mfg": 214,
			"mpu": 28,
			"rating": "8.2"
		},
		"title": "The Addams Family",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 21,
			"mfg": 214,
			"mpu": 31,
			"rating": "8.0"
		},
		"title": "The Addams Family Special Collectors Edition",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 23,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.6"
		},
		"title": "Adventures of Rocky and Bullwinkle and Friends",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 27,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "A-Go-Go",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 28,
			"mfg": 47,
			"rating": "6.5"
		},
		"title": "Air Aces",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 35,
			"mfg": 93,
			"rating": "6.2"
		},
		"title": "Airport",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 40,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Aladdin's Castle",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 43,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.3"
		},
		"title": "Ali",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 48,
			"mfg": 351,
			"mpu": 43,
			"rating": "7.6"
		},
		"title": "Alien Poker",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 62,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Aloha",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 63,
			"mfg": 350,
			"rating": "7.4"
		},
		"title": "Alpine Club",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 66,
			"mfg": 94,
			"mpu": 16,
			"rating": "7.3"
		},
		"title": "Amazon Hunt",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 71,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Amigo",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 73,
			"mfg": 126,
			"mpu": 47,
			"rating": "7.0"
		},
		"title": "Andromeda",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 77,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Apollo",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 79,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Aquarius",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 82,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.1"
		},
		"title": "Arena",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 84,
			"mfg": 351,
			"rating": "6.4"
		},
		"title": "Argosy",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 99,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Astro",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 105,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Atlantis",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 106,
			"mfg": 214,
			"mpu": 38,
			"rating": "7.2"
		},
		"title": "Atlantis",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 119,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Aztec",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 125,
			"mfg": 47,
			"mpu": 19,
			"rating": "6.7"
		},
		"title": "Baby Pac-Man",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 126,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.7"
		},
		"title": "Back to the Future",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 127,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.7"
		},
		"title": "Bad Cats",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 128,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.2"
		},
		"title": "Bad Girls",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 151,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Bally Hoo",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 169,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Bank Shot",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 170,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Bank-A-Ball",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 175,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.8"
		},
		"title": "Banzai Run",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 177,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.5"
		},
		"title": "Barracora",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 185,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Baseball",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 195,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.1"
		},
		"title": "Batman",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 201,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Bazaar",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 211,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "Beat the Clock",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 213,
			"mfg": 351,
			"rating": "5.8"
		},
		"title": "Beat Time",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 232,
			"mfg": 351,
			"rating": "6.6"
		},
		"title": "Big Ben",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 234,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Big Brave",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 239,
			"mfg": 93,
			"rating": "6.4"
		},
		"title": "Big Casino",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 240,
			"mfg": 350,
			"rating": "7.2"
		},
		"title": "Big Chief",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 242,
			"mfg": 350,
			"rating": "7.5"
		},
		"title": "Big Daddy",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 244,
			"mfg": 350,
			"rating": "7.1"
		},
		"title": "Big Deal",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 245,
			"mfg": 351,
			"rating": "7.3"
		},
		"title": "Big Deal",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 249,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.3"
		},
		"title": "Big Game",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 250,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.1"
		},
		"title": "Big Guns",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 253,
			"mfg": 94,
			"rating": "7.4"
		},
		"title": "Big Hit",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 256,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.3"
		},
		"title": "Big House",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 257,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Big Indian",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 271,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Big Shot",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 286,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Big Top",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 289,
			"mfg": 47,
			"rating": "8.1"
		},
		"title": "Big Valley",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 290,
			"mfg": 47,
			"rating": "7.8"
		},
		"title": "Bikini",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 307,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.7"
		},
		"title": "Black Hole",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 309,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.4"
		},
		"title": "Black Jack",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 310,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.9"
		},
		"title": "Black Knight",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 311,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.8"
		},
		"title": "Black Knight 2000",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 312,
			"mfg": 48,
			"mpu": 18,
			"rating": "6.8"
		},
		"title": "Black Pyramid",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 313,
			"mfg": 214,
			"mpu": 31,
			"rating": "8.0"
		},
		"title": "Black Rose",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 317,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.6"
		},
		"title": "Blackout",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 319,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.0"
		},
		"title": "Blackwater 100",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 325,
			"mfg": 351,
			"rating": "7.4"
		},
		"title": "Blue Chip",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 327,
			"mfg": 81,
			"rating": "5.8"
		},
		"title": "Blue Max",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 328,
			"mfg": 94,
			"rating": "7.3"
		},
		"title": "Blue Note",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 343,
			"mfg": 47,
			"rating": "7.0"
		},
		"title": "Bon Voyage",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 347,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.1"
		},
		"title": "Bone Busters Inc.",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 354,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Boomerang",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 361,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.1"
		},
		"title": "Bounty Hunter",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 362,
			"mfg": 47,
			"rating": "7.2"
		},
		"title": "Bow and Arrow",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 367,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Bowling Queen",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 368,
			"mfg": 47,
			"rating": "5.9"
		},
		"title": "Bowl-O",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 388,
			"mfg": 94,
			"rating": "7.2"
		},
		"title": "Bronco",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 391,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Buccaneer",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 392,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.3"
		},
		"title": "Buck Rogers",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 393,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Buckaroo",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 396,
			"mfg": 214,
			"mpu": 9,
			"rating": "6.8"
		},
		"title": "Bugs Bunny's Birthday Ball",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 410,
			"mfg": 282,
			"rating": "6.9"
		},
		"title": "Butterfly",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 416,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.3"
		},
		"title": "Cactus Jack's",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 426,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Canada Dry",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 431,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Capersville",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 433,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Capt. Card",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 438,
			"mfg": 47,
			"rating": "7.8"
		},
		"title": "Capt. Fantastic and The Brown Dirt Cowboy",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 446,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Card Trix",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 447,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Card Whiz",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 460,
			"mfg": 350,
			"rating": "6.0"
		},
		"title": "Casanova",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 466,
			"mfg": 81,
			"rating": "7.9"
		},
		"title": "Casino",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 469,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.5"
		},
		"title": "Catacomb",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 476,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.9"
		},
		"title": "Centaur",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 477,
			"mfg": 48,
			"mpu": 18,
			"rating": "7.8"
		},
		"title": "Centaur II",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 480,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Centigrade 37",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 481,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Central Park",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 486,
			"mfg": 47,
			"rating": "6.6"
		},
		"title": "Champ",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 492,
			"mfg": 94,
			"mpu": 14,
			"rating": "6.4"
		},
		"title": "Charlie's Angels",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 498,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.0"
		},
		"title": "Checkpoint",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 500,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.5"
		},
		"title": "Cheetah",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 513,
			"mfg": 81,
			"rating": "6.6"
		},
		"title": "Cinema",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 515,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.2"
		},
		"title": "Circus",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 521,
			"mfg": 47,
			"rating": "6.4"
		},
		"title": "Circus",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 528,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.7"
		},
		"title": "Class of 1812",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 532,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.5"
		},
		"title": "Cleopatra",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 536,
			"mfg": 94,
			"mpu": 14,
			"rating": "6.9"
		},
		"title": "Close Encounters of the Third Kind",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 543,
			"mfg": 93,
			"rating": "6.1"
		},
		"title": "College Queens",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 548,
			"mfg": 349,
			"mpu": 5,
			"rating": "7.7"
		},
		"title": "Comet",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 570,
			"mfg": 214,
			"mpu": 30,
			"rating": "8.0"
		},
		"title": "Corvette",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 571,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.3"
		},
		"title": "Cosmic Gunfight",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 572,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Cosmos",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 573,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.5"
		},
		"title": "Count-Down",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 575,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.6"
		},
		"title": "Counterforce",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 580,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Cover Girl",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 581,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Cow Poke",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 588,
			"mfg": 214,
			"mpu": 31,
			"rating": "8.2"
		},
		"title": "Creature from the Black Lagoon",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 601,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "Cross Town",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 610,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.4"
		},
		"title": "Cue Ball Wizard",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 614,
			"mfg": 48,
			"mpu": 18,
			"rating": "6.8"
		},
		"title": "Cybernaut",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 617,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.9"
		},
		"title": "Cyclone",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 635,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Dancing Lady",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 640,
			"mfg": 351,
			"rating": "5.3"
		},
		"title": "Darling",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 645,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.0"
		},
		"title": "Deadly Weapon",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 649,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Dealer's Choice",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 651,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.2"
		},
		"title": "Defender",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 654,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Delta Queen",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 662,
			"mfg": 349,
			"mpu": 29,
			"rating": "7.9"
		},
		"title": "Demolition Man",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 667,
			"mfg": 351,
			"rating": "6.8"
		},
		"title": "Derby Day",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 672,
			"mfg": 356,
			"mpu": 36,
			"rating": "7.5"
		},
		"title": "Devil Riders",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 673,
			"mfg": 94,
			"mpu": 16,
			"rating": "7.9"
		},
		"title": "Devil's Dare",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 676,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Diamond Jack",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 678,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.4"
		},
		"title": "Diamond Lady",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 680,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Dimension",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 681,
			"mfg": 349,
			"mpu": 9,
			"rating": "8.0"
		},
		"title": "Diner",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 682,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Ding Dong",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 683,
			"mfg": 351,
			"rating": "6.7"
		},
		"title": "Dipsy Doodle",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 684,
			"mfg": 349,
			"mpu": 30,
			"rating": "7.6"
		},
		"title": "Dirty Harry",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 692,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "Dixieland",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 695,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Dodge City",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 696,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Dogies",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 698,
			"mfg": 47,
			"mpu": 18,
			"rating": "6.7"
		},
		"title": "Dolly Parton",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 701,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Domino",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 703,
			"mfg": 351,
			"rating": "7.1"
		},
		"title": "Doodle Bug",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 704,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Doozie",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 728,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.0"
		},
		"title": "Dracula",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 729,
			"mfg": 94,
			"mpu": 14,
			"rating": "5.8"
		},
		"title": "Dragon",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 735,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Drop-A-Card",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 737,
			"mfg": 214,
			"mpu": 9,
			"rating": "7.8"
		},
		"title": "Dr. Dude And His Excellent Ray",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 738,
			"mfg": 214,
			"mpu": 31,
			"rating": "7.9"
		},
		"title": "Doctor Who",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 743,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.2"
		},
		"title": "Dungeons & Dragons",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 744,
			"mfg": 93,
			"rating": "6.6"
		},
		"title": "Duotron",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 753,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.9"
		},
		"title": "Earthshaker",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 758,
			"mfg": 93,
			"rating": "7.0"
		},
		"title": "Egg Head",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 760,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.0"
		},
		"title": "Eight Ball",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 761,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.4"
		},
		"title": "Eight Ball Champ",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 762,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.7"
		},
		"title": "Eight Ball Deluxe",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 763,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.3"
		},
		"title": "Eight Ball Deluxe Limited Edition",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 764,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "8 Ball",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 766,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "El Dorado",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 767,
			"mfg": 257,
			"mpu": 16,
			"rating": "6.8"
		},
		"title": "El Dorado City of Gold",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 770,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "El Toro",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 772,
			"mfg": 47,
			"rating": "6.1"
		},
		"title": "El Toro",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 778,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.4"
		},
		"title": "Elektra",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 782,
			"mfg": 214,
			"mpu": 8,
			"rating": "8.0"
		},
		"title": "Elvira and the Party Monsters",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 783,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.8"
		},
		"title": "Embryon",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 789,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.5"
		},
		"title": "Escape from the Lost World",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 793,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Evel Knievel",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 798,
			"mfg": 351,
			"rating": "7.2"
		},
		"title": "Expo",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 800,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Expressway",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 802,
			"mfg": 94,
			"rating": "7.4"
		},
		"title": "Eye Of The Tiger",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 804,
			"mfg": 349,
			"mpu": 7,
			"rating": "7.8"
		},
		"title": "F-14 Tomcat",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 806,
			"mfg": 282,
			"rating": "7.2"
		},
		"title": "Faces",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 820,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Fan-Tas-Tic",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 823,
			"mfg": 93,
			"rating": "7.2"
		},
		"title": "Far Out",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 824,
			"mfg": 356,
			"mpu": 36,
			"rating": "7.8"
		},
		"title": "Farfalla",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 825,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Fashion Show",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 828,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Fast Draw",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 829,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.9"
		},
		"title": "Fathom",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 851,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Fire Queen",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 852,
			"mfg": 47,
			"rating": "7.9"
		},
		"title": "Fireball",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 853,
			"mfg": 48,
			"mpu": 18,
			"rating": "7.2"
		},
		"title": "Fireball Classic",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 854,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.7"
		},
		"title": "Fireball II",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 855,
			"mfg": 47,
			"rating": "7.2"
		},
		"title": "Firecracker",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 856,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.8"
		},
		"title": "Firepower",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 857,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.3"
		},
		"title": "Firepower II",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 859,
			"mfg": 349,
			"mpu": 7,
			"rating": "7.4"
		},
		"title": "Fire",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 861,
			"mfg": 349,
			"mpu": 31,
			"rating": "8.0"
		},
		"title": "Fish Tales",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 871,
			"mfg": 351,
			"mpu": 2,
			"rating": "7.6"
		},
		"title": "Flash",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 874,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.9"
		},
		"title": "Flash Gordon",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 883,
			"mfg": 47,
			"rating": "5.5"
		},
		"title": "Flicker",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 887,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.6"
		},
		"title": "Flight 2000",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 888,
			"mfg": 349,
			"mpu": 30,
			"rating": "7.8"
		},
		"title": "The Flintstones",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 889,
			"mfg": 47,
			"rating": "6.8"
		},
		"title": "Flip Flop",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 890,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Flip a Card",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 892,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Flipper Clown",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 894,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Flipper Fair",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 895,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Flipper Parade",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 899,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Flying Carpet",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 901,
			"mfg": 93,
			"rating": "6.6"
		},
		"title": "Flying Chariots",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 902,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Flying Circus",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 910,
			"mfg": 213,
			"rating": "7.9"
		},
		"title": "Flying Turns",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 927,
			"mfg": 93,
			"rating": "6.9"
		},
		"title": "Foto Finish",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 928,
			"mfg": 351,
			"rating": "7.0"
		},
		"title": "4 Aces",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 935,
			"mfg": 47,
			"rating": "7.8"
		},
		"title": "Four Million B.C.",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 936,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "4 Queens",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 938,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "4 Roses",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 939,
			"mfg": 93,
			"rating": "6.9"
		},
		"title": "Four Seasons",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 940,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "4 Square",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 947,
			"mfg": 280,
			"mpu": 25,
			"rating": "7.9"
		},
		"title": "Mary Shelley's Frankenstein",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 948,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.7"
		},
		"title": "Freddy A Nightmare on Elm Street",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 949,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Free Fall",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 952,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Freedom",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 953,
			"mfg": 302,
			"mpu": 34,
			"rating": "6.6"
		},
		"title": "Freefall",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 959,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.3"
		},
		"title": "Frontier",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 961,
			"mfg": 350,
			"rating": "7.5"
		},
		"title": "Full House",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 966,
			"mfg": 349,
			"mpu": 10,
			"rating": "8.1"
		},
		"title": "Funhouse",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 972,
			"mfg": 351,
			"rating": "7.2"
		},
		"title": "Fun-Fest",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 973,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Fun Land",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 974,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.5"
		},
		"title": "Future Spa",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 980,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.4"
		},
		"title": "Galaxy",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 985,
			"mfg": 214,
			"mpu": 9,
			"rating": "7.2"
		},
		"title": "The Bally Game Show",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 988,
			"mfg": 93,
			"rating": "7.0"
		},
		"title": "Gaucho",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 989,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Gay 90's",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 996,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.3"
		},
		"title": "Genesis",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 997,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.3"
		},
		"title": "Genie",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1000,
			"mfg": 349,
			"mpu": 31,
			"rating": "8.1"
		},
		"title": "The Getaway: High Speed II",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 1003,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Gigi",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 1004,
			"mfg": 214,
			"mpu": 27,
			"rating": "6.9"
		},
		"title": "Gilligan's Island",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1005,
			"mfg": 81,
			"rating": "6.5"
		},
		"title": "Gin",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 1011,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.2"
		},
		"title": "Gladiators",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1024,
			"mfg": 48,
			"mpu": 19,
			"rating": "7.0"
		},
		"title": "Gold Ball",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 1036,
			"mfg": 351,
			"rating": "7.1"
		},
		"title": "Gold Rush",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1042,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Gold Strike",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1043,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.9"
		},
		"title": "Gold Wings",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1044,
			"mfg": 94,
			"rating": "7.4"
		},
		"title": "Golden Arrow",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1062,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.5"
		},
		"title": "Gorgar",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1070,
			"mfg": 349,
			"mpu": 6,
			"rating": "7.4"
		},
		"title": "Grand Lizard",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1072,
			"mfg": 351,
			"rating": "7.5"
		},
		"title": "Grand Prix",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1078,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Grand Slam",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1081,
			"mfg": 47,
			"rating": "7.3"
		},
		"title": "Grand Tour",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1088,
			"mfg": 351,
			"rating": "5.1"
		},
		"title": "Gridiron",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1094,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Gulfstream",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1100,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "Guns N' Roses",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 1112,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Hang Glider",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1114,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Happy Clown",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1122,
			"mfg": 48,
			"mpu": 38,
			"rating": "6.7"
		},
		"title": "Hardbody",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1125,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.5"
		},
		"title": "Harlem Globetrotters On Tour",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1126,
			"mfg": 214,
			"mpu": 10,
			"rating": "6.1"
		},
		"title": "Harley-Davidson",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1133,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.6"
		},
		"title": "Haunted House",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 1143,
			"mfg": 351,
			"rating": "7.4"
		},
		"title": "Hayburners II",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1145,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Hearts and Spades",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1148,
			"mfg": 350,
			"rating": "7.8"
		},
		"title": "Heat Wave",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1150,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.0"
		},
		"title": "Heavy Metal Meltdown",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1152,
			"mfg": 81,
			"rating": "7.2"
		},
		"title": "Hee Haw",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1155,
			"mfg": 33,
			"mpu": 45,
			"rating": "5.2"
		},
		"title": "Hercules",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1157,
			"mfg": 47,
			"rating": "7.2"
		},
		"title": "Hi-Deal",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1158,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Hi Dolly",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1160,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Hi-Score",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1161,
			"mfg": 81,
			"rating": "5.7"
		},
		"title": "Hi-Score Pool",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1173,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "High Hand",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1176,
			"mfg": 349,
			"mpu": 6,
			"rating": "7.9"
		},
		"title": "High Speed",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1187,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Hi-Lo Ace",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1193,
			"mfg": 351,
			"rating": "8.7"
		},
		"title": "Hit and Run Base-Ball",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 1206,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Hokus Pokus",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1214,
			"mfg": 81,
			"rating": "6.6"
		},
		"title": "Hollywood",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1219,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.0"
		},
		"title": "Hollywood Heat",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1224,
			"mfg": 93,
			"rating": "8.0"
		},
		"title": "Home Run",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1230,
			"mfg": 351,
			"rating": "7.2"
		},
		"title": "Honey",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1233,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.5"
		},
		"title": "Hook",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 1235,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.0"
		},
		"title": "Hoops",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1244,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.1"
		},
		"title": "Hot Hand",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1245,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "Hot Line",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 1247,
			"mfg": 93,
			"rating": "7.2"
		},
		"title": "Hot Shot",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1248,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.7"
		},
		"title": "Hot Shots",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1251,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Hot Tip",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1253,
			"mfg": 81,
			"rating": "8.0"
		},
		"title": "Hula-Hula",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1256,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Hurdy Gurdy",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 1257,
			"mfg": 349,
			"mpu": 27,
			"rating": "7.4"
		},
		"title": "Hurricane",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1260,
			"mfg": 257,
			"mpu": 16,
			"rating": "6.7"
		},
		"title": "Ice Fever",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 1262,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Ice-Revue",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1266,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.3"
		},
		"title": "The Incredible Hulk",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1267,
			"mfg": 349,
			"mpu": 29,
			"rating": "8.3"
		},
		"title": "Indiana Jones: The Pinball Adventure",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1270,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.0"
		},
		"title": "Iron Maiden",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 1277,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Jack In The Box",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1279,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Jackpot",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1281,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Jacks Open",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1290,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Jet Spin",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1298,
			"mfg": 351,
			"rating": "6.5"
		},
		"title": "Jive Time",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 1306,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.9"
		},
		"title": "Joker Poker",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1308,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.6"
		},
		"title": "Jokerz",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 1314,
			"mfg": 351,
			"rating": "7.3"
		},
		"title": "Jolly Roger",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1317,
			"mfg": 47,
			"rating": "7.2"
		},
		"title": "Joust",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1321,
			"mfg": 351,
			"rating": "4.7"
		},
		"title": "Jubilee",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1322,
			"mfg": 214,
			"mpu": 29,
			"rating": "8.0"
		},
		"title": "Judge Dredd",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1329,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Jumping Jack",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1332,
			"mfg": 93,
			"rating": "6.8"
		},
		"title": "Jungle",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1336,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Jungle King",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1338,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.7"
		},
		"title": "Jungle Lord",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1339,
			"mfg": 94,
			"rating": "8.0"
		},
		"title": "Jungle Princess",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1340,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Jungle Queen",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1343,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "Jurassic Park",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1363,
			"mfg": 81,
			"rating": "7.4"
		},
		"title": "Kicker",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 1365,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Kick Off",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1371,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "King Kool",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1372,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "King of Diamonds",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1374,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "King Pin",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1375,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "King Pin",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 1377,
			"mfg": 93,
			"rating": "6.9"
		},
		"title": "King Rock",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1378,
			"mfg": 47,
			"rating": "4.9"
		},
		"title": "King Tut",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1381,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Kings & Queens",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1382,
			"mfg": 48,
			"mpu": 18,
			"rating": "7.2"
		},
		"title": "Kings of Steel",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 1385,
			"mfg": 350,
			"rating": "8.0"
		},
		"title": "Kismet",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 1386,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.0"
		},
		"title": "Kiss",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1388,
			"mfg": 351,
			"rating": "7.8"
		},
		"title": "Klondike",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1392,
			"mfg": 47,
			"rating": "5.8"
		},
		"title": "Knockout",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 1402,
			"mfg": 48,
			"mpu": 38,
			"rating": "6.2"
		},
		"title": "Lady Luck",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1404,
			"mfg": 351,
			"rating": "7.8"
		},
		"title": "Lady Luck",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1405,
			"mfg": 262,
			"rating": "7.3"
		},
		"title": "Lady Luck",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1410,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Lancers",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 1413,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.3"
		},
		"title": "Laser Ball",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1414,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.2"
		},
		"title": "Laser Cue",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 1415,
			"mfg": 98,
			"mpu": 22,
			"rating": "7.8"
		},
		"title": "Laser War",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1416,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "Last Action Hero",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1419,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Lawman",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1433,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.5"
		},
		"title": "Lethal Weapon 3",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 1436,
			"mfg": 351,
			"rating": "7.1"
		},
		"title": "Liberty Bell",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1438,
			"mfg": 93,
			"rating": "6.3"
		},
		"title": "Liberty Belle",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 1441,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.4"
		},
		"title": "Lightning",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1445,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.5"
		},
		"title": "Lights...Camera...Action",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1447,
			"mfg": 351,
			"rating": "8.0"
		},
		"title": "Line Drive",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1458,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Little Chief",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1460,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Little Joe",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1476,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.0"
		},
		"title": "Lost World",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1483,
			"mfg": 351,
			"rating": "7.5"
		},
		"title": "Lucky Ace",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 1488,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Lucky Hand",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1491,
			"mfg": 351,
			"mpu": 1,
			"rating": "7.0"
		},
		"title": "Lucky Seven",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1498,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "Lucky Strike",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1502,
			"mfg": 349,
			"mpu": 10,
			"rating": "8.0"
		},
		"title": "The Machine: Bride of Pinbot",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1509,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.2"
		},
		"title": "Magic",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1514,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "Magic City",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1519,
			"mfg": 93,
			"rating": "5.8"
		},
		"title": "Magnotron",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 1528,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Majorettes",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1546,
			"mfg": 47,
			"rating": "7.2"
		},
		"title": "Mariner",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1549,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.3"
		},
		"title": "Mars God of War",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1550,
			"mfg": 282,
			"rating": "7.4"
		},
		"title": "Mars Trek",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1553,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Masquerade",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 1557,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Mata Hari",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1561,
			"mfg": 98,
			"mpu": 25,
			"rating": "7.5"
		},
		"title": "Maverick The Movie",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 1562,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Mayfair",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 1565,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.6"
		},
		"title": "Medusa",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1566,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Melody",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1577,
			"mfg": 350,
			"rating": "7.4"
		},
		"title": "Merry Widow",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 1580,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.6"
		},
		"title": "Meteor",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1589,
			"mfg": 93,
			"rating": "7.0"
		},
		"title": "Mibs",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1590,
			"mfg": 33,
			"mpu": 44,
			"rating": "6.1"
		},
		"title": "Middle Earth",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1597,
			"mfg": 349,
			"mpu": 7,
			"rating": "7.2"
		},
		"title": "Millionaire",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1605,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Mini Pool",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1606,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "MiniZag",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1612,
			"mfg": 351,
			"rating": "6.6"
		},
		"title": "Miss-O",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1616,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.2"
		},
		"title": "Monday Night Football",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1621,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Monte Carlo",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1622,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.1"
		},
		"title": "Monte Carlo",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1627,
			"mfg": 47,
			"rating": "5.4"
		},
		"title": "Moon Shot",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 1633,
			"mfg": 48,
			"mpu": 38,
			"rating": "6.8"
		},
		"title": "Motordome",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1634,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "Moulin Rouge",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1635,
			"mfg": 214,
			"mpu": 8,
			"rating": "7.8"
		},
		"title": "Mousin' Around",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1639,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.1"
		},
		"title": "Mr. & Mrs. Pac-Man Pinball",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 1645,
			"mfg": 94,
			"rating": "7.6"
		},
		"title": "Mustang",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1647,
			"mfg": 20,
			"rating": "7.4"
		},
		"title": "Mystery Castle",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1650,
			"mfg": 47,
			"mpu": 18,
			"rating": "6.7"
		},
		"title": "Mystic",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1662,
			"mfg": 94,
			"rating": "8.0"
		},
		"title": "Neptune",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1677,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Night Rider",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1678,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.4"
		},
		"title": "Nine Ball",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 1680,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Nip-It",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1682,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.7"
		},
		"title": "Nitro Ground Shaker",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1683,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "North Star",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1687,
			"mfg": 302,
			"mpu": 21,
			"rating": "6.5"
		},
		"title": "Nugent",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1692,
			"mfg": 47,
			"rating": "6.8"
		},
		"title": "Odds & Evens",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1702,
			"mfg": 93,
			"rating": "5.6"
		},
		"title": "Oklahoma",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 1704,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "Old Chicago",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1709,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Olympic Hockey",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1714,
			"mfg": 93,
			"rating": "6.9"
		},
		"title": "Olympics",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 1715,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "On Beam",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1721,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.5"
		},
		"title": "Operation: Thunder",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 1722,
			"mfg": 47,
			"rating": "6.9"
		},
		"title": "Op-Pop-Pop",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1724,
			"mfg": 93,
			"rating": "6.5"
		},
		"title": "Orbit",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1725,
			"mfg": 302,
			"mpu": 34,
			"rating": "5.7"
		},
		"title": "Orbitor 1",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 1727,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Out of Sight",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 1728,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Outer Space",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1733,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "OXO",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1735,
			"mfg": 351,
			"rating": "7.4"
		},
		"title": "Paddock",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1737,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Palace Guard",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1745,
			"mfg": 94,
			"mpu": 15,
			"rating": "6.8"
		},
		"title": "Panthera",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 1752,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Paradise",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 1755,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.7"
		},
		"title": "Paragon",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1763,
			"mfg": 48,
			"mpu": 38,
			"rating": "6.9"
		},
		"title": "Party Animal",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 1764,
			"mfg": 214,
			"mpu": 27,
			"rating": "7.8"
		},
		"title": "The Party Zone",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 1767,
			"mfg": 351,
			"rating": "6.9"
		},
		"title": "Pat Hand",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1768,
			"mfg": 93,
			"rating": "7.2"
		},
		"title": "Paul Bunyan",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1777,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.3"
		},
		"title": "Phantom of the Opera",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 1778,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.2"
		},
		"title": "Pharaoh",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1780,
			"mfg": 351,
			"mpu": 2,
			"rating": "7.1"
		},
		"title": "Phoenix",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1789,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Pin-Up",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1795,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.3"
		},
		"title": "Pinball Pool",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 1796,
			"mfg": 349,
			"mpu": 7,
			"rating": "7.9"
		},
		"title": "PINBOT",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1800,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.2"
		},
		"title": "Pink Panther",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 1802,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Pioneer",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 1805,
			"mfg": 20,
			"rating": "7.1"
		},
		"title": "Pistol Poker",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 1806,
			"mfg": 351,
			"rating": "6.9"
		},
		"title": "Pit Stop",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 1816,
			"mfg": 93,
			"rating": "6.8"
		},
		"title": "Playball",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 1822,
			"mfg": 98,
			"mpu": 23,
			"rating": "6.9"
		},
		"title": "Playboy 35th Anniversary",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1823,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.4"
		},
		"title": "Playboy",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 1841,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.6"
		},
		"title": "Police Force",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1848,
			"mfg": 214,
			"mpu": 9,
			"rating": "7.1"
		},
		"title": "Pool Sharks",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 1849,
			"mfg": 93,
			"rating": "8.0"
		},
		"title": "Pop-A-Card",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 1851,
			"mfg": 214,
			"mpu": 29,
			"rating": "7.3"
		},
		"title": "Popeye Saves the Earth",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 1853,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Post Time",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1858,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.4"
		},
		"title": "Power Play",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1865,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Pro-Football",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1866,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "Pro Pool",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1871,
			"mfg": 282,
			"rating": "7.5"
		},
		"title": "Prospector",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1893,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Quick Draw",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1895,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.1"
		},
		"title": "Quicksilver",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 1903,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Rack-A-Ball",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 1904,
			"mfg": 214,
			"mpu": 9,
			"rating": "7.7"
		},
		"title": "Radical",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 1918,
			"mfg": 351,
			"rating": "7.5"
		},
		"title": "Rancho",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 1922,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.1"
		},
		"title": "Raven",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1933,
			"mfg": 81,
			"rating": "4.4"
		},
		"title": "Red Baron",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 1951,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.8"
		},
		"title": "Rescue 911",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 1965,
			"mfg": 350,
			"rating": "7.2"
		},
		"title": "River Boat",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 1966,
			"mfg": 349,
			"mpu": 9,
			"rating": "7.4"
		},
		"title": "Riverboat Gambler",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 1969,
			"mfg": 47,
			"rating": "5.5"
		},
		"title": "Ro Go",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 1970,
			"mfg": 349,
			"mpu": 6,
			"rating": "7.7"
		},
		"title": "Road Kings",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 1971,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Road Race",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 1972,
			"mfg": 349,
			"mpu": 30,
			"rating": "8.1"
		},
		"title": "Red & Ted's Road Show",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 1975,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.9"
		},
		"title": "Robo-War",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 1976,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.2"
		},
		"title": "Robocop",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 1978,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.5"
		},
		"title": "Rock",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 1989,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "Rocket III",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 1993,
			"mfg": 94,
			"mpu": 16,
			"rating": "7.3"
		},
		"title": "Rocky",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 2002,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Roller Coaster",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2005,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.0"
		},
		"title": "Roller Disco",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2006,
			"mfg": 349,
			"mpu": 9,
			"rating": "7.4"
		},
		"title": "Rollergames",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 2010,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.0"
		},
		"title": "Rolling Stones",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2035,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "Royal Flush",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2037,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Royal Guard",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 2057,
			"mfg": 351,
			"rating": "6.2"
		},
		"title": "Satin Doll",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2067,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.2"
		},
		"title": "Scorpion",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2077,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Scuba",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2085,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Sea Ray",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2086,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Sea Shore",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2089,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.4"
		},
		"title": "Seawitch",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2090,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.6"
		},
		"title": "Secret Service",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2091,
			"mfg": 47,
			"rating": "7.8"
		},
		"title": "See Saw",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2104,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Seven Up",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2110,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Shangri-La",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2113,
			"mfg": 126,
			"mpu": 47,
			"rating": "7.3"
		},
		"title": "Sharpshooter",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2116,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Sheriff",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2119,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Ship Ahoy",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2120,
			"mfg": 93,
			"rating": "7.1"
		},
		"title": "Ship-Mates",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2130,
			"mfg": 93,
			"rating": "6.9"
		},
		"title": "Show Boat",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 2152,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.3"
		},
		"title": "Silver Slugger",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 2156,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.4"
		},
		"title": "Silverball Mania",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2158,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.5"
		},
		"title": "The Simpsons",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 2159,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.6"
		},
		"title": "Sinbad",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2160,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Sing Along",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2165,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.2"
		},
		"title": "The Six Million Dollar Man",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2170,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.4"
		},
		"title": "Skateball",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2182,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "Skill Pool",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2195,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Sky Jump",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2196,
			"mfg": 47,
			"rating": "7.0"
		},
		"title": "Sky Kings",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 2202,
			"mfg": 351,
			"rating": "7.4"
		},
		"title": "Skylab",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2204,
			"mfg": 47,
			"rating": "8.2"
		},
		"title": "Skyrocket",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2208,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Slick Chick",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2215,
			"mfg": 351,
			"rating": "6.8"
		},
		"title": "Smart Set",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2229,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Snow Derby",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2232,
			"mfg": 350,
			"rating": "7.2"
		},
		"title": "Soccer",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2233,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Soccer",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2237,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Solar City",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2238,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.4"
		},
		"title": "Solar Fire",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 2239,
			"mfg": 94,
			"mpu": 14,
			"rating": "7.4"
		},
		"title": "Solar Ride",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2240,
			"mfg": 351,
			"rating": "6.2"
		},
		"title": "Solids N Stripes",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2242,
			"mfg": 351,
			"mpu": 5,
			"rating": "7.9"
		},
		"title": "Sorcerer",
		"year": 1985
	},
	{
		"ipdb": {
			"number": 2243,
			"mfg": 81,
			"rating": "5.3"
		},
		"title": "Sound Stage",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2252,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.6"
		},
		"title": "Space Invaders",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2253,
			"mfg": 351,
			"rating": "7.8"
		},
		"title": "Space Mission",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2254,
			"mfg": 351,
			"rating": "7.3"
		},
		"title": "Space Odyssey",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2258,
			"mfg": 33,
			"mpu": 44,
			"rating": "7.3"
		},
		"title": "Space Riders",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2259,
			"mfg": 350,
			"rating": "7.6"
		},
		"title": "Space Ship",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 2260,
			"mfg": 351,
			"mpu": 5,
			"rating": "7.7"
		},
		"title": "Space Shuttle",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 2261,
			"mfg": 349,
			"mpu": 8,
			"rating": "7.8"
		},
		"title": "Space Station",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 2262,
			"mfg": 47,
			"rating": "7.3"
		},
		"title": "Space Time",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2265,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Spanish Eyes",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2272,
			"mfg": 48,
			"mpu": 38,
			"rating": "6.7"
		},
		"title": "Special Force",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 2274,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.1"
		},
		"title": "Spectrum",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 2285,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.5"
		},
		"title": "The Amazing Spider-Man",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2286,
			"mfg": 93,
			"rating": "7.4"
		},
		"title": "Spin Out",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2287,
			"mfg": 93,
			"rating": "6.7"
		},
		"title": "Spin Wheel",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 2288,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Spin-A-Card",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2292,
			"mfg": 94,
			"mpu": 16,
			"rating": "7.2"
		},
		"title": "Spirit",
		"year": 1982
	},
	{
		"ipdb": {
			"number": 2293,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Spirit of 76",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2297,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.0"
		},
		"title": "Split Second",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 2324,
			"mfg": 257,
			"mpu": 17,
			"rating": "6.6"
		},
		"title": "Spring Break",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 2328,
			"mfg": 48,
			"mpu": 18,
			"rating": "7.3"
		},
		"title": "Spy Hunter",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 2330,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Square Head",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2346,
			"mfg": 302,
			"mpu": 34,
			"rating": "7.2"
		},
		"title": "Star Gazer",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2347,
			"mfg": 47,
			"rating": "7.5"
		},
		"title": "Star-Jet",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2352,
			"mfg": 351,
			"rating": "6.6"
		},
		"title": "Star Pool",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2355,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.1"
		},
		"title": "Star Trek",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2356,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.3"
		},
		"title": "Star Trek",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 2357,
			"mfg": 349,
			"mpu": 29,
			"rating": "8.3"
		},
		"title": "Star Trek: The Next Generation",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2358,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "Star Wars",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 2359,
			"mfg": 351,
			"rating": "7.2"
		},
		"title": "Stardust",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2366,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.3"
		},
		"title": "Stars",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2372,
			"mfg": 351,
			"mpu": 2,
			"rating": "7.4"
		},
		"title": "Stellar Wars",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2377,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.1"
		},
		"title": "Stingray",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2386,
			"mfg": 350,
			"rating": "7.7"
		},
		"title": "Stop 'N' Go",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2393,
			"mfg": 351,
			"rating": "6.8"
		},
		"title": "Straight Flush",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2396,
			"mfg": 48,
			"mpu": 38,
			"rating": "7.5"
		},
		"title": "Strange Science",
		"year": 1986
	},
	{
		"ipdb": {
			"number": 2397,
			"mfg": 94,
			"rating": "7.6"
		},
		"title": "Strange World",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2398,
			"mfg": 351,
			"rating": "7.2"
		},
		"title": "Strato-Flite",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2403,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.2"
		},
		"title": "Street Fighter II",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2404,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Strike Zone",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2406,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.6"
		},
		"title": "Strikes and Spares",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2408,
			"mfg": 351,
			"rating": "8.0"
		},
		"title": "Student Prince",
		"year": 1968
	},
	{
		"ipdb": {
			"number": 2412,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Subway",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 2422,
			"mfg": 93,
			"rating": "6.2"
		},
		"title": "Sunset",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 2435,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.4"
		},
		"title": "Super Mario Bros.",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 2441,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Super Score",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2443,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Super Soccer",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2445,
			"mfg": 94,
			"rating": "7.5"
		},
		"title": "Super Spin",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2446,
			"mfg": 351,
			"rating": "7.5"
		},
		"title": "Super Star",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2449,
			"mfg": 282,
			"rating": "7.1"
		},
		"title": "Super Straight",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2452,
			"mfg": 351,
			"rating": "7.1"
		},
		"title": "Super-Flite",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2454,
			"mfg": 33,
			"mpu": 45,
			"rating": "7.3"
		},
		"title": "Superman",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2455,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.1"
		},
		"title": "Supersonic",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2457,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Sure Shot",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2459,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Surf Champ",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2461,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.3"
		},
		"title": "Surf 'n Safari",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 2464,
			"mfg": 93,
			"rating": "7.5"
		},
		"title": "Surf Side",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2465,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Surfer",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2466,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Surfers",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2469,
			"mfg": 351,
			"rating": "8.0"
		},
		"title": "Suspense",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2474,
			"mfg": 93,
			"rating": "7.9"
		},
		"title": "Sweet Hearts",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2484,
			"mfg": 93,
			"rating": "7.2"
		},
		"title": "Swing-Along",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2485,
			"mfg": 351,
			"rating": "7.5"
		},
		"title": "Swinger",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2486,
			"mfg": 349,
			"mpu": 8,
			"rating": "8.0"
		},
		"title": "Swords of Fury",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2493,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "Tales from the Crypt",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2500,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Target Alpha",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2502,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Target Pool",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2505,
			"mfg": 349,
			"mpu": 8,
			"rating": "8.0"
		},
		"title": "Taxi",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2506,
			"mfg": 350,
			"rating": "7.8"
		},
		"title": "Teacher's Pet",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 2507,
			"mfg": 94,
			"rating": "8.2"
		},
		"title": "Team One",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2508,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.5"
		},
		"title": "Tee'd Off",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2509,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.3"
		},
		"title": "Teenage Mutant Ninja Turtles",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 2517,
			"mfg": 350,
			"rating": "8.5"
		},
		"title": "Ten Spot",
		"year": 1961
	},
	{
		"ipdb": {
			"number": 2524,
			"mfg": 349,
			"mpu": 27,
			"rating": "8.0"
		},
		"title": "Terminator 2: Judgment Day",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 2528,
			"mfg": 214,
			"mpu": 30,
			"rating": "8.0"
		},
		"title": "The Shadow",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 2534,
			"mfg": 93,
			"rating": "7.6"
		},
		"title": "Thoro-Bred",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 2535,
			"mfg": 350,
			"rating": "7.4"
		},
		"title": "3 Coins",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 2539,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "\"300\"",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2563,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.0"
		},
		"title": "Time Fantasy",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 2564,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.5"
		},
		"title": "Time Line",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2565,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.8"
		},
		"title": "Time Machine",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2568,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.5"
		},
		"title": "Time Warp",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2569,
			"mfg": 47,
			"rating": "7.6"
		},
		"title": "Time Zone",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2573,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.0"
		},
		"title": "Title Fight",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 2577,
			"mfg": 351,
			"rating": "7.0"
		},
		"title": "Toledo",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2578,
			"mfg": 350,
			"rating": "6.9"
		},
		"title": "Tom Tom",
		"year": 1963
	},
	{
		"ipdb": {
			"number": 2579,
			"mfg": 98,
			"mpu": 24,
			"rating": "8.0"
		},
		"title": "The Who's Tommy Pinball Wizard",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 2580,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Top Card",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2589,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Top Score",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2590,
			"mfg": 262,
			"rating": "7.7"
		},
		"title": "Top Speed",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2595,
			"mfg": 94,
			"mpu": 14,
			"rating": "6.9"
		},
		"title": "Torch",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2603,
			"mfg": 98,
			"mpu": 23,
			"rating": "7.3"
		},
		"title": "Torpedo Alley",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2609,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Touchdown",
		"year": 1967
	},
	{
		"ipdb": {
			"number": 2610,
			"mfg": 257,
			"mpu": 16,
			"rating": "7.0"
		},
		"title": "Touchdown",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 2621,
			"mfg": 350,
			"rating": "7.8"
		},
		"title": "Trade Winds",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 2625,
			"mfg": 47,
			"rating": "8.0"
		},
		"title": "Trail Drive",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2630,
			"mfg": 214,
			"mpu": 8,
			"rating": "7.4"
		},
		"title": "Transporter the Rescue",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 2636,
			"mfg": 351,
			"rating": "7.7"
		},
		"title": "Travel Time",
		"year": 1973
	},
	{
		"ipdb": {
			"number": 2641,
			"mfg": 351,
			"mpu": 3,
			"rating": "7.0"
		},
		"title": "Tri Zone",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2644,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.0"
		},
		"title": "Trident",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2647,
			"mfg": 47,
			"rating": "7.4"
		},
		"title": "Trio",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 2648,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Triple Action",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2652,
			"mfg": 351,
			"rating": "7.6"
		},
		"title": "Triple Strike",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 2661,
			"mfg": 93,
			"rating": "7.3"
		},
		"title": "Tropic Isle",
		"year": 1962
	},
	{
		"ipdb": {
			"number": 2667,
			"mfg": 214,
			"mpu": 38,
			"rating": "7.4"
		},
		"title": "Truck Stop",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2684,
			"mfg": 214,
			"mpu": 31,
			"rating": "8.4"
		},
		"title": "Twilight Zone",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2689,
			"mfg": 47,
			"rating": "7.7"
		},
		"title": "Twin Win",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2697,
			"mfg": 93,
			"rating": "8.0"
		},
		"title": "2001",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2699,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.3"
		},
		"title": "TX-Sector",
		"year": 1988
	},
	{
		"ipdb": {
			"number": 2716,
			"mfg": 47,
			"rating": "5.6"
		},
		"title": "Vampire",
		"year": 1970
	},
	{
		"ipdb": {
			"number": 2723,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.3"
		},
		"title": "Vector",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 2733,
			"mfg": 257,
			"mpu": 17,
			"rating": "7.0"
		},
		"title": "Victory",
		"year": 1987
	},
	{
		"ipdb": {
			"number": 2737,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.2"
		},
		"title": "Viking",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2742,
			"mfg": 94,
			"mpu": 15,
			"rating": "7.6"
		},
		"title": "Volcano",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 2743,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "Volley",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 2744,
			"mfg": 47,
			"mpu": 18,
			"rating": "6.9"
		},
		"title": "Voltan Escapes Cosmic Doom",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2745,
			"mfg": 94,
			"rating": "7.7"
		},
		"title": "Vulcan",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 2765,
			"mfg": 349,
			"mpu": 8,
			"rating": "8.0"
		},
		"title": "Whirlwind",
		"year": 1990
	},
	{
		"ipdb": {
			"number": 2768,
			"mfg": 349,
			"mpu": 31,
			"rating": "8.2"
		},
		"title": "White Water",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2783,
			"mfg": 302,
			"mpu": 21,
			"rating": "7.5"
		},
		"title": "Wild Fyre",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2784,
			"mfg": 93,
			"rating": "6.8"
		},
		"title": "Wild Life",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2787,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "Wild Wild West",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2792,
			"mfg": 351,
			"rating": "6.3"
		},
		"title": "Winner",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2799,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.5"
		},
		"title": "Wipe Out",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 2803,
			"mfg": 47,
			"rating": "7.8"
		},
		"title": "Wizard",
		"year": 1974
	},
	{
		"ipdb": {
			"number": 2808,
			"mfg": 257,
			"mpu": 37,
			"rating": "6.7"
		},
		"title": "World Challenge Soccer",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 2810,
			"mfg": 351,
			"mpu": 1,
			"rating": "6.4"
		},
		"title": "World Cup",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 2811,
			"mfg": 214,
			"mpu": 30,
			"rating": "7.9"
		},
		"title": "World Cup Soccer",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 2812,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "World Fair",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2813,
			"mfg": 93,
			"rating": "7.8"
		},
		"title": "World Series",
		"year": 1972
	},
	{
		"ipdb": {
			"number": 2820,
			"mfg": 98,
			"mpu": 24,
			"rating": "7.9"
		},
		"title": "WWF Royal Rumble",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 2821,
			"mfg": 47,
			"mpu": 18,
			"rating": "7.8"
		},
		"title": "Xenon",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 2822,
			"mfg": 48,
			"mpu": 18,
			"rating": "6.7"
		},
		"title": "X's & O's",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 2834,
			"mfg": 350,
			"rating": "7.5"
		},
		"title": "Zig Zag",
		"year": 1964
	},
	{
		"ipdb": {
			"number": 2840,
			"mfg": 47,
			"rating": "7.3"
		},
		"title": "Zip-A-Doo",
		"year": 1969
	},
	{
		"ipdb": {
			"number": 2841,
			"mfg": 351,
			"rating": "7.0"
		},
		"title": "Zodiac",
		"year": 1971
	},
	{
		"ipdb": {
			"number": 2845,
			"mfg": 214,
			"mpu": 30,
			"rating": "8.3"
		},
		"title": "Theatre of Magic",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 2847,
			"mfg": 257,
			"mpu": 37,
			"rating": "8.0"
		},
		"title": "Stargate",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 2848,
			"mfg": 280,
			"mpu": 25,
			"rating": "7.9"
		},
		"title": "Baywatch",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 2852,
			"mfg": 349,
			"mpu": 30,
			"rating": "7.7"
		},
		"title": "No Fear: Dangerous Sports",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 2853,
			"mfg": 214,
			"mpu": 30,
			"rating": "7.9"
		},
		"title": "Indianapolis 500",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 2868,
			"mfg": 2,
			"rating": "7.0"
		},
		"title": "The Empire Strikes Back",
		"year": 1980
	},
	{
		"ipdb": {
			"number": 2874,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.4"
		},
		"title": "Shaq Attaq",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3072,
			"mfg": 349,
			"mpu": 31,
			"rating": "8.1"
		},
		"title": "Bram Stoker's Dracula",
		"year": 1993
	},
	{
		"ipdb": {
			"number": 3163,
			"mfg": 351,
			"mpu": 1,
			"rating": "7.3"
		},
		"title": "Hot Tip",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 3169,
			"mfg": 351,
			"mpu": 4,
			"rating": "7.1"
		},
		"title": "Hyperball",
		"year": 1981
	},
	{
		"ipdb": {
			"number": 3240,
			"mfg": 93,
			"rating": "7.7"
		},
		"title": "SkyLine",
		"year": 1965
	},
	{
		"ipdb": {
			"number": 3281,
			"mfg": 349,
			"mpu": 27,
			"rating": "7.6"
		},
		"title": "SlugFest (First Model)",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 3419,
			"mfg": 356,
			"rating": "7.2"
		},
		"title": "Supersonic",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 3427,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.2"
		},
		"title": "Super Mario Bros. Mushroom World",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 3494,
			"mfg": 356,
			"mpu": 36,
			"rating": "6.5"
		},
		"title": "Time Machine",
		"year": 1983
	},
	{
		"ipdb": {
			"number": 3507,
			"mfg": 159,
			"mpu": 17,
			"rating": "7.2"
		},
		"title": "Night Moves",
		"year": 1989
	},
	{
		"ipdb": {
			"number": 3513,
			"mfg": 20,
			"rating": "6.9"
		},
		"title": "Al's Garage Band Goes On a World Tour",
		"year": 1992
	},
	{
		"ipdb": {
			"number": 3591,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.6"
		},
		"title": "Frank Thomas' Big Hurt",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3592,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.8"
		},
		"title": "Apollo 13",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3593,
			"mfg": 280,
			"mpu": 25,
			"rating": "7.9"
		},
		"title": "Batman Forever",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3596,
			"mfg": 76,
			"mpu": 32,
			"rating": "8.0"
		},
		"title": "Pinball Magic",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3619,
			"mfg": 349,
			"mpu": 30,
			"rating": "7.5"
		},
		"title": "JackBot",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3676,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.7"
		},
		"title": "Car Hop",
		"year": 1991
	},
	{
		"ipdb": {
			"number": 3683,
			"mfg": 349,
			"mpu": 30,
			"rating": "7.9"
		},
		"title": "Johnny Mnemonic",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3685,
			"mfg": 214,
			"mpu": 30,
			"rating": "8.0"
		},
		"title": "WHO dunnit",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3780,
			"mfg": 349,
			"mpu": 11,
			"rating": "8.0"
		},
		"title": "Congo",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3781,
			"mfg": 214,
			"mpu": 11,
			"rating": "8.1"
		},
		"title": "Attack from Mars",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3782,
			"mfg": 214,
			"mpu": 11,
			"rating": "8.0"
		},
		"title": "Safe Cracker",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3783,
			"mfg": 76,
			"mpu": 32,
			"rating": "7.5"
		},
		"title": "Airborne",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3784,
			"mfg": 76,
			"mpu": 32,
			"rating": "7.4"
		},
		"title": "Breakshot",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3792,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.8"
		},
		"title": "Goldeneye",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3793,
			"mfg": 257,
			"mpu": 37,
			"rating": "6.9"
		},
		"title": "Waterworld",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3794,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.0"
		},
		"title": "Mario Andretti",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 3795,
			"mfg": 257,
			"mpu": 37,
			"rating": "7.3"
		},
		"title": "Barb Wire",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3824,
			"mfg": 349,
			"mpu": 11,
			"rating": "8.2"
		},
		"title": "Tales of the Arabian Nights",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3878,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.6"
		},
		"title": "Independence Day",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3879,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.4"
		},
		"title": "Space Jam",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3887,
			"mfg": 157,
			"rating": "7.2"
		},
		"title": "Dragon",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 3915,
			"mfg": 214,
			"mpu": 11,
			"rating": "8.3"
		},
		"title": "Scared Stiff",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3945,
			"mfg": 76,
			"mpu": 32,
			"rating": "6.8"
		},
		"title": "Flipper Football",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 3976,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.2"
		},
		"title": "Twister",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 4000,
			"mfg": 76,
			"mpu": 32,
			"rating": "7.1"
		},
		"title": "Kingpin",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 4001,
			"mfg": 76,
			"mpu": 32,
			"rating": "7.3"
		},
		"title": "Big Bang Bar",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 4014,
			"mfg": 349,
			"mpu": 11,
			"rating": "7.9"
		},
		"title": "Junk Yard",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 4023,
			"mfg": 214,
			"mpu": 11,
			"rating": "7.7"
		},
		"title": "NBA Fastbreak",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4032,
			"mfg": 349,
			"mpu": 11,
			"rating": "8.3"
		},
		"title": "Medieval Madness",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4054,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.1"
		},
		"title": "Star Wars Trilogy",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4059,
			"mfg": 214,
			"mpu": 11,
			"rating": "8.1"
		},
		"title": "Cirqus Voltaire",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4116,
			"mfg": 47,
			"rating": "6.6"
		},
		"title": "Fireball",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 4136,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.1"
		},
		"title": "The Lost World Jurassic Park",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4137,
			"mfg": 280,
			"mpu": 33,
			"rating": "6.6"
		},
		"title": "The X Files",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4336,
			"mfg": 257,
			"mpu": 37,
			"rating": "6.9"
		},
		"title": "Strikes 'N Spares",
		"year": 1995
	},
	{
		"ipdb": {
			"number": 4338,
			"mfg": 349,
			"mpu": 11,
			"rating": "8.0"
		},
		"title": "No Good Gofers",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4341,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.8"
		},
		"title": "Starship Troopers",
		"year": 1997
	},
	{
		"ipdb": {
			"number": 4354,
			"mfg": 214,
			"mpu": 30,
			"rating": "7.7"
		},
		"title": "The Pinball Circus",
		"year": 1994
	},
	{
		"ipdb": {
			"number": 4358,
			"mfg": 214,
			"mpu": 11,
			"rating": "7.8"
		},
		"title": "The Champion Pub",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4359,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.0"
		},
		"title": "Viper Night Drivin'",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4441,
			"mfg": 349,
			"mpu": 11,
			"rating": "8.2"
		},
		"title": "Monster Bash",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4442,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.0"
		},
		"title": "Lost In Space",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4443,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.2"
		},
		"title": "Godzilla",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4444,
			"mfg": 280,
			"mpu": 33,
			"rating": "7.0"
		},
		"title": "South Park",
		"year": 1999
	},
	{
		"ipdb": {
			"number": 4445,
			"mfg": 214,
			"mpu": 11,
			"rating": "8.0"
		},
		"title": "Cactus Canyon",
		"year": 1998
	},
	{
		"ipdb": {
			"number": 4446,
			"mfg": 214,
			"mpu": 12,
			"rating": "8.0"
		},
		"title": "Revenge From Mars",
		"year": 1999
	},
	{
		"ipdb": {
			"number": 4453,
			"mfg": 280,
			"rating": "6.5"
		},
		"title": "Harley-Davidson",
		"year": 1999
	},
	{
		"ipdb": {
			"number": 4455,
			"mfg": 303,
			"mpu": 33,
			"rating": "6.6"
		},
		"title": "Harley-Davidson (1st Edition)",
		"year": 1999
	},
	{
		"ipdb": {
			"number": 4458,
			"mfg": 349,
			"mpu": 12,
			"rating": "7.4"
		},
		"title": "Star Wars Episode I",
		"year": 1999
	},
	{
		"ipdb": {
			"number": 4459,
			"mfg": 303,
			"mpu": 33,
			"rating": "6.8"
		},
		"title": "Striker Xtreme",
		"year": 2000
	},
	{
		"ipdb": {
			"number": 4492,
			"mfg": 303,
			"mpu": 33,
			"rating": "6.9"
		},
		"title": "Sharkey's Shootout",
		"year": 2000
	},
	{
		"ipdb": {
			"number": 4497,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.4"
		},
		"title": "Night Rider",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 4499,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.4"
		},
		"title": "Evel Knievel",
		"year": 1976
	},
	{
		"ipdb": {
			"number": 4501,
			"mfg": 47,
			"mpu": 13,
			"rating": "7.8"
		},
		"title": "Mata Hari",
		"year": 1977
	},
	{
		"ipdb": {
			"number": 4502,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.3"
		},
		"title": "High Roller Casino",
		"year": 2001
	},
	{
		"ipdb": {
			"number": 4504,
			"mfg": 303,
			"mpu": 33,
			"rating": "6.6"
		},
		"title": "Austin Powers",
		"year": 2001
	},
	{
		"ipdb": {
			"number": 4505,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.4"
		},
		"title": "Monopoly",
		"year": 2001
	},
	{
		"ipdb": {
			"number": 4506,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.4"
		},
		"title": "Playboy",
		"year": 2002
	},
	{
		"ipdb": {
			"number": 4536,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.2"
		},
		"title": "RollerCoaster Tycoon",
		"year": 2002
	},
	{
		"ipdb": {
			"number": 4618,
			"mfg": 375,
			"rating": "7.7"
		},
		"title": "Jolly Park",
		"year": 1996
	},
	{
		"ipdb": {
			"number": 4664,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.9"
		},
		"title": "Harley-Davidson (2nd Edition)",
		"year": 2002
	},
	{
		"ipdb": {
			"number": 4673,
			"mfg": 94,
			"rating": "7.9"
		},
		"title": "Sinbad",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 4674,
			"mfg": 303,
			"mpu": 33,
			"rating": "8.1"
		},
		"title": "The Simpsons Pinball Party",
		"year": 2003
	},
	{
		"ipdb": {
			"number": 4769,
			"mfg": 94,
			"rating": "6.7"
		},
		"title": "Solar Ride",
		"year": 1979
	},
	{
		"ipdb": {
			"number": 4778,
			"mfg": 93,
			"rating": "8.0"
		},
		"title": "Ice Show",
		"year": 1966
	},
	{
		"ipdb": {
			"number": 4787,
			"mfg": 303,
			"mpu": 33,
			"rating": "7.5"
		},
		"title": "Terminator 3: Rise of the Machines",
		"year": 2003
	},
	{
		"ipdb": {
			"number": 4858,
			"mfg": 303,
			"mpu": 41,
			"rating": "8.1"
		},
		"title": "The Lord of the Rings",
		"year": 2003
	},
	{
		"ipdb": {
			"number": 4868,
			"mfg": 371,
			"rating": "7.5"
		},
		"title": "Impacto",
		"year": 1975
	},
	{
		"ipdb": {
			"number": 4917,
			"mfg": 303,
			"mpu": 41,
			"rating": "8.0"
		},
		"title": "Ripley's Believe It or Not",
		"year": 2003
	},
	{
		"ipdb": {
			"number": 4983,
			"mfg": 303,
			"mpu": 41,
			"rating": "7.6"
		},
		"title": "Elvis",
		"year": 2004
	},
	{
		"ipdb": {
			"number": 5021,
			"mfg": 48,
			"mpu": 18,
			"rating": "7.3"
		},
		"title": "Eight Ball Deluxe",
		"year": 1984
	},
	{
		"ipdb": {
			"number": 5053,
			"mfg": 303,
			"mpu": 41,
			"rating": "7.4"
		},
		"title": "The Sopranos",
		"year": 2005
	},
	{
		"ipdb": {
			"number": 5078,
			"mfg": 94,
			"rating": "7.8"
		},
		"title": "Joker Poker",
		"year": 1978
	},
	{
		"ipdb": {
			"number": 5093,
			"mfg": 303,
			"mpu": 41,
			"rating": "7.0"
		},
		"title": "NASCAR",
		"year": 2005
	},
	{
		"ipdb": {
			"number": 5120,
			"mfg": 303,
			"mpu": 41,
			"rating": "7.3"
		},
		"title": "Grand Prix",
		"year": 2005
	},
	{
		"ipdb": {
			"number": 5134,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.2"
		},
		"title": "World Poker Tour",
		"year": 2006
	},
	{
		"ipdb": {
			"number": 5163,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "Pirates of the Caribbean",
		"year": 2006
	},
	{
		"ipdb": {
			"number": 5164,
			"mfg": 492,
			"rating": "5.3"
		},
		"title": "Pirates of the Caribbean Dead Man's Chest",
		"year": 2006
	},
	{
		"ipdb": {
			"number": 5219,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.7"
		},
		"title": "Family Guy",
		"year": 2006
	},
	{
		"ipdb": {
			"number": 5230,
			"mfg": 508,
			"rating": "4.6"
		},
		"title": "UltraPin",
		"year": 2006
	},
	{
		"ipdb": {
			"number": 5237,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Spider-Man",
		"year": 2007
	},
	{
		"ipdb": {
			"number": 5244,
			"mfg": 511,
			"mpu": 32,
			"rating": "7.1"
		},
		"title": "Big Bang Bar",
		"year": 2007
	},
	{
		"ipdb": {
			"number": 5254,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "Wheel Of Fortune",
		"year": 2007
	},
	{
		"ipdb": {
			"number": 5292,
			"mfg": 303,
			"rating": "7.5"
		},
		"title": "Dale Jr.",
		"year": 2007
	},
	{
		"ipdb": {
			"number": 5301,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.8"
		},
		"title": "Shrek",
		"year": 2008
	},
	{
		"ipdb": {
			"number": 5306,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.1"
		},
		"title": "Indiana Jones",
		"year": 2008
	},
	{
		"ipdb": {
			"number": 5307,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Batman",
		"year": 2008
	},
	{
		"ipdb": {
			"number": 5348,
			"mfg": 303,
			"mpu": 54,
			"rating": "6.7"
		},
		"title": "CSI",
		"year": 2008
	},
	{
		"ipdb": {
			"number": 5419,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.0"
		},
		"title": "24",
		"year": 2009
	},
	{
		"ipdb": {
			"number": 5442,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "NBA",
		"year": 2009
	},
	{
		"ipdb": {
			"number": 5513,
			"mfg": 303,
			"mpu": 54,
			"rating": "6.9"
		},
		"title": "Big Buck Hunter Pro",
		"year": 2009
	},
	{
		"ipdb": {
			"number": 5550,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.9"
		},
		"title": "Iron Man",
		"year": 2010
	},
	{
		"ipdb": {
			"number": 5558,
			"mfg": 303,
			"mpu": 41,
			"rating": "8.0"
		},
		"title": "The Lord of the Rings (Limited Edition)",
		"year": 2009
	},
	{
		"ipdb": {
			"number": 5618,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "James Camerons Avatar",
		"year": 2010
	},
	{
		"ipdb": {
			"number": 5650,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Spider-Man (Black Suited)",
		"year": 2007
	},
	{
		"ipdb": {
			"number": 5653,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.8"
		},
		"title": "James Camerons Avatar (Limited Edition)",
		"year": 2010
	},
	{
		"ipdb": {
			"number": 5668,
			"mfg": 303,
			"mpu": 54,
			"rating": "6.7"
		},
		"title": "The Rolling Stones",
		"year": 2011
	},
	{
		"ipdb": {
			"number": 5682,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Disney TRON Legacy",
		"year": 2011
	},
	{
		"ipdb": {
			"number": 5707,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Disney TRON Legacy (Limited Edition)",
		"year": 2011
	},
	{
		"ipdb": {
			"number": 5709,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.7"
		},
		"title": "Transformers (Pro)",
		"year": 2011
	},
	{
		"ipdb": {
			"number": 5753,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.4"
		},
		"title": "Transformers Limited Edition (\"Combo\")",
		"year": 2011
	},
	{
		"ipdb": {
			"number": 5767,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "AC/DC (Pro)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5775,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.9"
		},
		"title": "AC/DC (Premium)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5776,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.8"
		},
		"title": "AC/DC Let There Be Rock Limited Edition",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5777,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.8"
		},
		"title": "AC/DC Back In Black Limited Edition",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5800,
			"mfg": 634,
			"rating": "7.9"
		},
		"title": "The Wizard of Oz",
		"year": 2013
	},
	{
		"ipdb": {
			"number": 5822,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "X-Men (Pro)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5824,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.2"
		},
		"title": "X-Men Wolverine LE",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5938,
			"mfg": 303,
			"mpu": 54,
			"rating": "6.8"
		},
		"title": "The Avengers (Pro)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 5967,
			"mfg": 634,
			"rating": "8.0"
		},
		"title": "Emerald City Limited Edition Wizard of Oz",
		"year": 2013
	},
	{
		"ipdb": {
			"number": 6028,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.8"
		},
		"title": "Metallica (Pro)",
		"year": 2013
	},
	{
		"ipdb": {
			"number": 6030,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.5"
		},
		"title": "Metallica (Premium Monsters)",
		"year": 2013
	},
	{
		"ipdb": {
			"number": 6031,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Metallica Master of Puppets (Limited Edition)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 6044,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Star Trek (Starfleet Pro)",
		"year": 2013
	},
	{
		"ipdb": {
			"number": 6046,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.0"
		},
		"title": "Star Trek (Enterprise Limited Edition)",
		"year": 2012
	},
	{
		"ipdb": {
			"number": 6098,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.4"
		},
		"title": "Mustang (Pro)",
		"year": 2014
	},
	{
		"ipdb": {
			"number": 6155,
			"mfg": 303,
			"mpu": 54,
			"rating": "7.2"
		},
		"title": "The Walking Dead (Pro)",
		"year": 2014
	},
	{
		"ipdb": {
			"number": 6156,
			"mfg": 303,
			"mpu": 54,
			"rating": "8.6"
		},
		"title": "The Walking Dead (Limited Edition)",
		"year": 2014
	},
	{
		"ipdb": {
			"number": 6161,
			"mfg": 671,
			"mpu": 60,
			"rating": "8.6"
		},
		"title": "America's Most Haunted",
		"year": 2014
	},
	{
		"ipdb": {
			"number": 6265,
			"mfg": 303,
			"mpu": 61,
			"rating": "8.0"
		},
		"title": "KISS (Pro)",
		"year": 2015
	}
];

export default ipdb;