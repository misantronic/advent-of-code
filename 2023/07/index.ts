import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

type Card =
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'T'
    | 'J'
    | 'Q'
    | 'K'
    | 'A';

const evalHand = (hand: string, orgHand = hand, jValue = 20) => {
    const cards = hand.split('') as Card[];
    const orgCards = orgHand.split('') as Card[];

    const isFiveOfAKind = cards.every((card) => card === cards[0]);
    const isFourOfAKind = cards.some(
        (card) => cards.filter((c) => c === card).length === 4
    );
    const isThreeOfAKind = cards.some(
        (card) => cards.filter((c) => c === card).length === 3
    );
    const isOnePair = cards.some(
        (card) => cards.filter((c) => c === card).length === 2
    );
    const pairs = cards.filter(
        (card, index, self) => self.indexOf(card) !== index
    );
    const isTwoPair = new Set(pairs).size === 2;
    const isFullHouse = isThreeOfAKind && isOnePair;
    const isHighCard =
        new Set(cards).size === 5 &&
        !isOnePair &&
        !isTwoPair &&
        !isThreeOfAKind &&
        !isFourOfAKind &&
        !isFiveOfAKind;

    const scores: number[] = [];

    if (isFiveOfAKind) {
        scores.push(7);
    } else if (isFourOfAKind) {
        scores.push(6);
    } else if (isFullHouse) {
        scores.push(5);
    } else if (isThreeOfAKind) {
        scores.push(4);
    } else if (isTwoPair) {
        scores.push(3);
    } else if (isOnePair) {
        scores.push(2);
    } else if (isHighCard) {
        scores.push(1);
    }

    scores.push(
        ...orgCards.map((card) => {
            switch (card) {
                case '2':
                    return 11;
                case '3':
                    return 12;
                case '4':
                    return 13;
                case '5':
                    return 14;
                case '6':
                    return 15;
                case '7':
                    return 16;
                case '8':
                    return 17;
                case '9':
                    return 18;
                case 'T':
                    return 19;
                case 'J':
                    return jValue;
                case 'Q':
                    return 21;
                case 'K':
                    return 22;
                case 'A':
                    return 23;
            }
        })
    );

    return parseInt(scores.join(''));
};

const hands1 = input1.map((line) => {
    const [hand, bid] = line.split(' ');

    return { hand, bid: parseInt(bid), score: evalHand(hand) };
});

console.time('part 1');
console.log(
    'part 1:',
    hands1
        .sort((a, b) => a.score - b.score)
        .reduce((acc, curr, i) => acc + curr.bid * (i + 1), 0)
);
console.timeEnd('part 1');

console.time('part 2');
console.log('');

const createNewHand = (hand: string, index: number, newCard: Card) => {
    return hand.substring(0, index) + newCard + hand.substring(index + 1);
};

const exchangeCards: Card[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A'
];

const hands2 = input1.map((line) => {
    const [hand, bid] = line.split(' ');
    const allHands: string[] = [hand];

    while (allHands.some((hand) => hand.includes('J'))) {
        allHands.forEach((hand, i) => {
            const cards = hand.split('') as Card[];

            delete allHands[i];

            cards.forEach((card, i) => {
                if (card === 'J') {
                    exchangeCards.forEach((newCard) => {
                        allHands.push(createNewHand(hand, i, newCard as Card));
                    });
                }
            });
        });
    }

    return {
        hand,
        bid: parseInt(bid),
        score: allHands.reduce(
            (score, h) => Math.max(evalHand(h, hand, 10), score),
            0
        )
    };
});

const sortedHands = hands2.sort((a, b) => a.score - b.score);

console.log(
    'part 2:',
    sortedHands.reduce((acc, curr, i) => acc + curr.bid * (i + 1), 0)
);

console.timeEnd('part 2');
