/* This function will be used to calculate the "half life" of posts. 
   Basically, a post with 100 votes just posted, 200 votes posted 48 hours ago,
   400 votes posted 4 days ago, and 800 votes posted 8 days ago will be roughly equal.
   This keeps the news feeds fresh.
   Interestingly enough, this can also be used to count comments - and by doing so,
   you'd be able to determine which posts are most "provocative" */

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const halfLifeCalculation = (
  n: number,
  dateCreated: Date,
  halfLifeDuration = FORTY_EIGHT_HOURS,
): number => {
  const elapsed = Date.now() - dateCreated.getTime();
  const factor = elapsed / halfLifeDuration;
  const divisor = Math.pow(2, factor);
  return n / divisor;
};
