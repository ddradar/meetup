/** ミッション情報 (オープン時) */
export type Mission = {
  /** ID (自動採番) */
  id: string
  /** ミッションNo (ソート用) */
  missionNo: number
  /** 枠の色 */
  color: string
  /** 題名 */
  title: string
  /** 曲名 */
  songName: string
  /** 譜面 */
  difficulty: string
  /** ミッション内容 */
  description: string
  /** 指定オプション */
  options: string[]
  /** クリア済みか */
  cleared: boolean
}

/** ミッション情報 (オープン前) */
export type MissionListData = Pick<
  Mission,
  'id' | 'missionNo' | 'color' | 'description'
>
