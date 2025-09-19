import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <div className="h-screen bg-background">
      <Navigation />
      <div className="pt-16 p-8">
        <p className="text-muted-foreground">Navigation component is shown at the top</p>
      </div>
    </div>
  );
}