export default function RainbowLoader({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full w-full animate-rainbow bg-rainbow bg-rainbow-size" />
    </div>
  );
}
