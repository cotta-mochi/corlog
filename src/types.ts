export interface Team {
  id: string
  name: string
  alias: string
  prefecture?: string
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
  homeTeam?: Team['id']
  scheduleKey: string
}

export interface Review {
  id?: string
  content: string
  createdAt: string
  updatedAt: string
  gameId: Game['id']
  uid?: string
}

export interface GameSatisfaction {
  gameId: Game['id']
  satisfaction?: number
  uid?: string
}

export interface GameMvp {
  gameId: Game['id']
  player?: Player
  reason?: string
}

export interface Player {
  id: string
  name: string
  alias: string
  number: string
  position: string
  photo?: string
}

export interface TeamPlayersLog {
  teamId: Team['id']
  players: Player[]
  createdAt: string
}
