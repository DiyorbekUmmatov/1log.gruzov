interface Count {
  icon: React.ReactElement;
  count: number | undefined;
}

export const Counts: React.FC<Count> = ({ icon, count }) => {
  return (
    <span className="flex items-center gap-x-1  justify-center rounded-2xl p-2 backdrop-blur-md bg-white/60  border border-white/20  shadow-sm hover:shadow-md active:translate-y-0.5 active:shadow-sm">
      {icon}
      <span className="text-sm text-gray-500">{count}</span>
    </span>
  );
};
