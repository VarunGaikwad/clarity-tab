export default function CachedFavicon({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <img
      src={`https://favicone.com/${new URL(url).hostname}?s=256`}
      alt={`${title} favicon`}
      width={32}
      height={32}
      className="rounded"
    />
  );
}
