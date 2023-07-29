export const ShareLinks = () => {
  return (
    <>
      <a href="https://twitter.com/share?url=<URL>&text=<TEXT>via=<USERNAME>">
        Twitter
      </a>

      <a href="https://www.facebook.com/sharer/sharer.php?u=<URL>">Facebook</a>

      <a href="https://reddit.com/submit?url=<URL>&title=<TITLE>">Reddit</a>

      <a href="https://news.ycombinator.com/submitlink?u=<URL>&t=<TITLE>">
        Hacker News
      </a>

      <a href="https://www.linkedin.com/shareArticle?url=<URL>&title=<TITLE>&summary=<SUMMARY>&source=<SOURCE_URL>">
        LinkedIn
      </a>

      <a href="mailto:?subject=<SUBJECT>&body=<BODY>">Email</a>
    </>
  );
};
