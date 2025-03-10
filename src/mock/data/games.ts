import type { Game } from '@/types'

export const games: Game[] = [
  {
    id: '1',
    date: '2024-01-01T19:05+09:00',
    location: '横浜国際プール',
    team1: {
      id: '1',
      name: '横浜ビー・コルセアーズ',
      alias: '横浜',
      color: {
        r: 0,
        g: 38,
        b: 58,
      },
    },
    team2: {
      id: '2',
      name: '千葉ジェッツ',
      alias: '千葉',
      color: {
        r: 240,
        g: 0,
        b: 30,
      },
    },
    scores: [
      {
        team1: 15,
        team2: 20,
      },
      {
        team1: 26,
        team2: 12,
      },
      {
        team1: 18,
        team2: 18,
      },
      {
        team1: 20,
        team2: 14,
      },
    ],
    status: 'upcoming',
    homeTeam: '横浜',
    scheduleKey: '503166',
  },
  {
    id: '2',
    date: '2024-01-02T19:05+09:00',
    location: '横浜国際プール',
    team1: {
      id: '1',
      name: '横浜ビー・コルセアーズ',
      alias: '横浜',
      color: {
        r: 0,
        g: 38,
        b: 58,
      },
    },
    team2: {
      id: '2',
      name: '千葉ジェッツ',
      alias: '千葉',
      color: {
        r: 240,
        g: 0,
        b: 30,
      },
    },
    status: 'live',
    homeTeam: '横浜',
    scheduleKey: '503167',
  },
]
