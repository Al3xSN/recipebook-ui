export const getStrength = (pw: string): 0 | 1 | 2 | 3 | 4 => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return score as 0 | 1 | 2 | 3 | 4;
};
