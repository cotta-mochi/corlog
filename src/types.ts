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
  date: Date
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
  linkUrl?: string
  photo?: string
}

export interface TeamPlayersLog {
  teamId: Team['id']
  players: Player[]
  createdAt: string
}

export interface WinnerPrediction {
  gameId: Game['id']
  winnerTeamId: Team['id'] | undefined
}

export interface WinnerResult {
  gameId: Game['id']
  winnerTeamId: Team['id'] | undefined
}

export interface ScoreLeaderPrediction {
  gameId: Game['id']
  scoreLeader: Player['id'] | undefined
}

export interface ScoreLeaderResult {
  gameId: Game['id']
  scoreLeaders: Player['id'] | undefined
}

export interface WhoScores29Prediction {
  gameId: Game['id']
  whoScores29: Player['id'][] | undefined
}

export interface WhoScores29Result {
  gameId: Game['id']
  whoScores29: Player['id'] | undefined
}

export interface Profile {
  uid: string
  name: string
  email: string
  photo?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SignUpUser {
  name: string
  email: string
  password: string
}
