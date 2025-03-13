export const nameRules = [
  (v: string) => !!v || 'アカウント名を入力してください',
  (v: string) => v.length >= 2 || 'アカウント名は2文字以上で入力してください',
  (v: string) => v.length <= 30 || 'アカウント名は30文字以内で入力してください',
]

export const emailRules = [
  (v: string) => !!v || 'メールアドレスを入力してください',
  (v: string) => /.+@.+/.test(v) || 'メールアドレスが正しくありません',
]

export const passwordRules = [
  (v: string) => !!v || 'パスワードを入力してください',
  (v: string) => v.length >= 8 || 'パスワードは8文字以上で入力してください',
]
