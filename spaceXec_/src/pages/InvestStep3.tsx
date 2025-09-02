import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InvestStep3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount } = location.state || {};

  const handleNext = (paymentMethod) => {
    navigate("/invest/checkout", { state: { totalAmount, paymentMethod } });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Step 3: Choose Payment Method</h1>

      <Button onClick={() => handleNext("UPI")} className="w-full bg-blue-600 mt-2">
        Pay via UPI
      </Button>
      <Button onClick={() => handleNext("Card")} className="w-full bg-blue-600 mt-2">
        Pay via Card
      </Button>
    </div>
  );
};

export default InvestStep3;
