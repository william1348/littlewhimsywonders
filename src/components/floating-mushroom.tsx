export function FloatingMushroom() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/ghost-mushroom.png" alt="" className="floating-mushroom" />
    </div>
  );
}
