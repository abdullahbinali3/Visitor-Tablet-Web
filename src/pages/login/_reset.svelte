<script>
  import { redirect } from "@roxi/routify";
  import user from "$stores/user-store.js";

  // If user already logged in, redirect to home page
  if ($user.isLoggedIn) {
    $redirect("/");
  }
</script>

<slot />

<!-- routify:options bundle=true -->
