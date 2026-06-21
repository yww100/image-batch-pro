import AdSense from './AdSense';

interface AdSlotProps {
  label?: string;
  slot?: string;
}

export default function AdSlot({ label = 'Advertisement', slot }: AdSlotProps) {
  return (
    <AdSense
      slot={slot || 'ad-slot-placeholder'}
      className="my-4"
      style={{ minHeight: 120 }}
    />
  );
}
