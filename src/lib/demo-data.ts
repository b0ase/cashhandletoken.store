export interface TokenRanking {
  id: string;
  symbol: string;
  handcashHandle: string;
  price: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  change24h: number;
  totalDividendsPaid: number;
  dividendPayments: number;
  owner: {
    displayName: string;
    profilePictureUrl?: string;
  };
}

// Realistic demo tokens for showcase
export const DEMO_TOKENS: TokenRanking[] = [
  {
    id: '1',
    symbol: '$NINJAPUNKGIRLS',
    handcashHandle: '@NinjaPunkGirls',
    price: 0.002450,
    marketCap: 2450000,
    holders: 342,
    volume24h: 125600,
    change24h: 18.5,
    totalDividendsPaid: 8750.25,
    dividendPayments: 24,
    owner: {
      displayName: 'Ninja Punk Girls NFT',
      profilePictureUrl: '/images/ninjapunk.png'
    }
  },
  {
    id: '2',
    symbol: '$PEPE',
    handcashHandle: '@PepeBSV',
    price: 0.001890,
    marketCap: 1890000,
    holders: 567,
    volume24h: 98400,
    change24h: -5.2,
    totalDividendsPaid: 4560.75,
    dividendPayments: 15,
    owner: {
      displayName: 'Pepe BSV Community',
      profilePictureUrl: '/images/pepe.png'
    }
  },
  {
    id: '3',
    symbol: '$HANDCASH',
    handcashHandle: '@HandCashOfficial',
    price: 0.003120,
    marketCap: 3120000,
    holders: 892,
    volume24h: 245600,
    change24h: 12.3,
    totalDividendsPaid: 15420.50,
    dividendPayments: 48,
    owner: {
      displayName: 'HandCash Inc.',
      profilePictureUrl: '/images/handcash.png'
    }
  },
  {
    id: '4',
    symbol: '$CRAIG',
    handcashHandle: '@DrCraigWright',
    price: 0.000890,
    marketCap: 890000,
    holders: 234,
    volume24h: 45600,
    change24h: 45.8,
    totalDividendsPaid: 2340.00,
    dividendPayments: 8,
    owner: {
      displayName: 'Dr. Craig S Wright',
      profilePictureUrl: '/images/craig.png'
    }
  },
  {
    id: '5',
    symbol: '$BITCOIN',
    handcashHandle: '@BitcoinSV',
    price: 0.004560,
    marketCap: 4560000,
    holders: 1234,
    volume24h: 456000,
    change24h: 8.9,
    totalDividendsPaid: 23450.00,
    dividendPayments: 92,
    owner: {
      displayName: 'Bitcoin SV Node',
      profilePictureUrl: '/images/bitcoin.png'
    }
  },
  {
    id: '6',
    symbol: '$TWETCH',
    handcashHandle: '@Twetch',
    price: 0.001230,
    marketCap: 1230000,
    holders: 456,
    volume24h: 67800,
    change24h: -2.3,
    totalDividendsPaid: 5670.25,
    dividendPayments: 19,
    owner: {
      displayName: 'Twetch Inc.',
      profilePictureUrl: '/images/twetch.png'
    }
  },
  {
    id: '7',
    symbol: '$RARECANDY',
    handcashHandle: '@RareCandy',
    price: 0.002780,
    marketCap: 2780000,
    holders: 678,
    volume24h: 134500,
    change24h: 22.4,
    totalDividendsPaid: 9870.50,
    dividendPayments: 31,
    owner: {
      displayName: 'RareCandy NFT',
      profilePictureUrl: '/images/rarecandy.png'
    }
  },
  {
    id: '8',
    symbol: '$DURO',
    handcashHandle: '@DuroDogs',
    price: 0.001560,
    marketCap: 1560000,
    holders: 345,
    volume24h: 78900,
    change24h: 6.7,
    totalDividendsPaid: 4320.75,
    dividendPayments: 12,
    owner: {
      displayName: 'Duro Dogs NFT',
      profilePictureUrl: '/images/duro.png'
    }
  },
  {
    id: '9',
    symbol: '$JINGLES',
    handcashHandle: '@Jingles',
    price: 0.000670,
    marketCap: 670000,
    holders: 123,
    volume24h: 23400,
    change24h: -8.9,
    totalDividendsPaid: 1230.00,
    dividendPayments: 5,
    owner: {
      displayName: 'Jingles Show',
      profilePictureUrl: '/images/jingles.png'
    }
  },
  {
    id: '10',
    symbol: '$HASTE',
    handcashHandle: '@HasteArcade',
    price: 0.002340,
    marketCap: 2340000,
    holders: 567,
    volume24h: 112300,
    change24h: 15.6,
    totalDividendsPaid: 7890.25,
    dividendPayments: 28,
    owner: {
      displayName: 'Haste Arcade',
      profilePictureUrl: '/images/haste.png'
    }
  },
  {
    id: '11',
    symbol: '$RELAYX',
    handcashHandle: '@RelayX',
    price: 0.001890,
    marketCap: 1890000,
    holders: 432,
    volume24h: 87600,
    change24h: 3.4,
    totalDividendsPaid: 5430.50,
    dividendPayments: 17,
    owner: {
      displayName: 'RelayX Wallet',
      profilePictureUrl: '/images/relayx.png'
    }
  },
  {
    id: '12',
    symbol: '$MEME',
    handcashHandle: '@MemeLord',
    price: 0.000450,
    marketCap: 450000,
    holders: 89,
    volume24h: 12300,
    change24h: -12.5,
    totalDividendsPaid: 890.75,
    dividendPayments: 3,
    owner: {
      displayName: 'Meme Lord BSV',
      profilePictureUrl: '/images/meme.png'
    }
  },
  {
    id: '13',
    symbol: '$SATOSHI',
    handcashHandle: '@SatoshiVision',
    price: 0.005670,
    marketCap: 5670000,
    holders: 1567,
    volume24h: 567000,
    change24h: 28.9,
    totalDividendsPaid: 34560.00,
    dividendPayments: 124,
    owner: {
      displayName: 'Satoshi Vision',
      profilePictureUrl: '/images/satoshi.png'
    }
  },
  {
    id: '14',
    symbol: '$PANDAS',
    handcashHandle: '@PandaWarriors',
    price: 0.001120,
    marketCap: 1120000,
    holders: 234,
    volume24h: 45600,
    change24h: 7.8,
    totalDividendsPaid: 3210.25,
    dividendPayments: 11,
    owner: {
      displayName: 'Panda Warriors NFT',
      profilePictureUrl: '/images/pandas.png'
    }
  },
  {
    id: '15',
    symbol: '$CENTBEE',
    handcashHandle: '@CentBee',
    price: 0.002890,
    marketCap: 2890000,
    holders: 789,
    volume24h: 156000,
    change24h: 11.2,
    totalDividendsPaid: 12340.50,
    dividendPayments: 42,
    owner: {
      displayName: 'CentBee Wallet',
      profilePictureUrl: '/images/centbee.png'
    }
  },
  {
    id: '16',
    symbol: '$TOKENIZED',
    handcashHandle: '@Tokenized',
    price: 0.003450,
    marketCap: 3450000,
    holders: 901,
    volume24h: 234000,
    change24h: 19.3,
    totalDividendsPaid: 18900.75,
    dividendPayments: 67,
    owner: {
      displayName: 'Tokenized Protocol',
      profilePictureUrl: '/images/tokenized.png'
    }
  },
  {
    id: '17',
    symbol: '$GORILLAPOOL',
    handcashHandle: '@GorillaPool',
    price: 0.001780,
    marketCap: 1780000,
    holders: 456,
    volume24h: 89000,
    change24h: -3.7,
    totalDividendsPaid: 6780.00,
    dividendPayments: 23,
    owner: {
      displayName: 'GorillaPool Mining',
      profilePictureUrl: '/images/gorilla.png'
    }
  },
  {
    id: '18',
    symbol: '$TAAL',
    handcashHandle: '@TAALMining',
    price: 0.004230,
    marketCap: 4230000,
    holders: 1123,
    volume24h: 345000,
    change24h: 14.5,
    totalDividendsPaid: 26700.25,
    dividendPayments: 89,
    owner: {
      displayName: 'TAAL Mining',
      profilePictureUrl: '/images/taal.png'
    }
  },
  {
    id: '19',
    symbol: '$BLOCKDOJO',
    handcashHandle: '@BlockDojo',
    price: 0.001340,
    marketCap: 1340000,
    holders: 321,
    volume24h: 56700,
    change24h: 5.6,
    totalDividendsPaid: 4560.50,
    dividendPayments: 14,
    owner: {
      displayName: 'Block Dojo',
      profilePictureUrl: '/images/blockdojo.png'
    }
  },
  {
    id: '20',
    symbol: '$MOON',
    handcashHandle: '@ToTheMoonBSV',
    price: 0.000890,
    marketCap: 890000,
    holders: 178,
    volume24h: 34500,
    change24h: 89.5,
    totalDividendsPaid: 2340.00,
    dividendPayments: 7,
    owner: {
      displayName: 'To The Moon BSV',
      profilePictureUrl: '/images/moon.png'
    }
  }
];