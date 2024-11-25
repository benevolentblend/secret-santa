const GamePreview: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="h-[140px] rounded-md border p-4 transition-all hover:bg-accent lg:h-[115px]">
    {children}
  </div>
);

export default GamePreview;
