import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">BlockPlane</h1>
        <p className="text-xl text-muted-foreground">Material Lifecycle Analysis</p>
        <Link to="/lifecycle">
          <Button size="lg">View Lifecycle Breakdown</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
