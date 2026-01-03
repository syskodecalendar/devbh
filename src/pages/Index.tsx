import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoorIntroScene from "@/components/DoorIntroScene";
import { useStore } from "@/store/useStore";

const Index = () => {
  const navigate = useNavigate();
  const { hasEnteredShowroom, setHasEnteredShowroom } = useStore();

  useEffect(() => {
    if (hasEnteredShowroom) {
      navigate("/showroom");
    }
  }, [hasEnteredShowroom, navigate]);

  const handleEnter = () => {
    setHasEnteredShowroom(true);
    navigate("/showroom");
  };

  return <DoorIntroScene onEnter={handleEnter} />;
};

export default Index;
