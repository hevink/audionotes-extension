import { Button } from "./components/ui/button";
import { createClient } from "./lib/supabase/client";

export default function GoogleAuth() {
  const supabase = createClient();

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "/",
      },
    });
    if (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Button
      className="gap-2 w-full border border-transparent bg-plain hover:border-border-hover  font-semibold text-heading"
      variant="plain"
      size="lg"
      onClick={handleGoogleAuth}
    >
      <span className="font-semibold font-Inter text-sm tracking-tight">
        Login with Google
      </span>
    </Button>
  );
}
