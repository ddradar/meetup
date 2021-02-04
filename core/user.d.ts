/** ユーザー情報 */
export type User = {
  /** 表示名 */
  name: string
  /** ホームのゲーセン */
  home: string
  /** 自由記入欄 */
  description: string
  /** 受注中のミッション */
  orderedMission: string | null
}
