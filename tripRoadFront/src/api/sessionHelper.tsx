export const getCurrentUserId = (): number => {
  return Number(sessionStorage.getItem("USER_ID"));
}