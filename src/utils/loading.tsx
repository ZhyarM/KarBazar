interface LoadingCircleProps {
  size?: number; // Tailwind size (e.g. 6, 8, 10, 14)
}

const LoadingCircle = ({
  size = 8,
 
}: LoadingCircleProps) => {
  return (
    <div
      className={`flex justify-center items-center h-screen bg-(--color-bg) `}
    >
      <div
        className={`
        animate-spin
        rounded-full
        border-4
        border-t-transparent
        text-(--color-bg-inverse)
        w-${size}
        h-${size}
        
      `}
      />
    </div>
  );
};

export default LoadingCircle;
