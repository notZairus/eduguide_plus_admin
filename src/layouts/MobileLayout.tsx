import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const navigator = useNavigate();

  return (
    <div className="w-screen h-screen bg-black flex pt-12 justify-center gap-12 items-start">
      <div
        className="aspect-square cursor-pointer rounded-full p-2 bg-white"
        onClick={() => {
          navigator(-1);
        }}
      >
        <ChevronLeft className="w-10 h-10 text-black" />
      </div>
      <main className="bg-white rounded-lg overflow-hidden w-2/9 max-w-70 h-11/12 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
