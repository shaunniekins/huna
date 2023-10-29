import Protected from "@/Protected";
import Home from "@/components/Home";

export default function HomeDashboard() {
  return (
    <Protected>
      <Home />
    </Protected>
  );
}
