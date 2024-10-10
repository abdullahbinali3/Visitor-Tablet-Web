<script>
  import { goto } from "@roxi/routify";
  import user from "$stores/user-store.js";
  import { guid_to_base64 } from "$helpers/guid.js";

  let uid = localStorage.getItem("uid");
  let organizationId = localStorage.getItem("organizationId");
  
  if (uid === $user.userData.uid) {
    // Redirect to /home/ without any user interaction
    $goto("/home" );
  } else {
    localStorage.removeItem("organizationId");
  }
</script>
