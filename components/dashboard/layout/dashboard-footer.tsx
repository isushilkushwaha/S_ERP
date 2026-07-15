export function DashboardFooter() {
  return (
    <footer className="border-t bg-background px-2 py-1 fixed bottom-0 w-full">
      <div className="flex flex-col items-center justify-center text-center space-y-1">
        
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} School ERP. Developed by SH Tech Lab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}