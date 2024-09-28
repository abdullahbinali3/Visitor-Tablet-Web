<script>
  import { sessionLogout } from "$helpers/auth.js";
  import appData from "$/stores/app-data-store.js";
  import Alert from "$components/common/Alert.svelte";
  import Button from "$components/common/Button.svelte";

  export let errorMessage;

  let formDisabled = false;
  let displayName;

  if ($appData.authTokenParsed) {
    displayName = $appData.authTokenParsed.name;

    if (!displayName) {
      displayName = $appData.authTokenParsed.preferred_username;
    }
  }

  function handleLogout() {
    formDisabled = true;
    sessionLogout();
  }
</script>

<div class="flex justify-center">
  <div
    class="max-w-2xl my-8 mx-4 p-8 space-y-4 bg-white border-md border-1
    border-gray-800 shadow">
    <h1 class="text-2xl">No System Access</h1>
    {#if displayName}
      <p>
        User Account:
        <span class="font-medium">{displayName}</span>
      </p>
    {/if}
    <p>
      You have successfully logged into your
      <span class="font-medium">OracleCMS Portals</span>
      account. However, your account does not have permission to access this
      system.
    </p>
    <p>
      Please contact
      <a href="mailto:helpdesk@oraclecms.com" class="text-sky-500">
        helpdesk@oraclecms.com
      </a>
      for assistance.
    </p>
    {#if errorMessage}
      <Alert>{errorMessage}</Alert>
    {/if}
    <div class="text-center">
      <Button on:click={handleLogout} block={true} disabled={formDisabled}>
        {!formDisabled ? 'Logout' : 'Logging out...'}
      </Button>
    </div>

    <!-- <pre class="text-xs">
      {JSON.stringify($appData.keycloak.tokenParsed, null, 4)}
    </pre> -->
  </div>
</div>
