<script>
  import { t } from "svelte-i18n";
  import Alert from "$components/common/Alert.svelte";

  export let formErrors = null;

  if (formErrors && formErrors.toString() === "TypeError: Failed to fetch") {
    formErrors = "An unknown error occurred. Please try again.";
  }
</script>

{#if formErrors}
  <Alert type="danger">
    <div class="space-y-3">
      {#if typeof formErrors !== "string" && formErrors.length > 1}
        <strong>{$t("error.followingErrorsOccurred")}</strong>
        <ul class="list-disc list-inside pl-3">
          {#each formErrors as error}
            <li>
              <span style="white-space: pre-wrap; word-break: break-word;">
                {$t(error)}
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <span style="white-space: pre-wrap; word-break: break-word;">
          {$t(formErrors.toString())}
        </span>
      {/if}
    </div>
    <div>
      <slot />
    </div>
  </Alert>
{/if}
