export interface Team {
  id: string
  name: string
  alias: string
  logo?: string
  color: {
    r: number
    g: number
    b: number
  }
}

export interface Score {
  team1: number
  team2: number
}

export interface Game {
  id: string
  date: string
  team1: Team
  team2: Team
  scores?: Score[]
  location?: string
  startTime?: string
  status: 'upcoming' | 'live' | 'finished'
  homeTeam: Team['id']
  scheduleKey: string
}

export interface Blog {
  id?: string
  content: string
  createdAt: string
  updatedAt: string
  gameId: Game['id']
}

export interface GameSatisfaction {
  gameId: Game['id']
  satisfaction?: number
}
