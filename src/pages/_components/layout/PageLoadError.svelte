<script>
  import { url } from "@roxi/routify";

  import Alert from "$components/common/Alert.svelte";
  import Button from "$components/common/Button.svelte";

  export let reloadFunc;
  export let errorMessages;

  if (
    errorMessages &&
    errorMessages.toString() === "TypeError: Failed to fetch"
  ) {
    errorMessages = null;
  }
</script>

<div
  class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center
  lg:px-8">
  <div class="max-w-max md:mx-auto">
    <main class="sm:flex">
      <p class="text-4xl font-extrabold text-red-600 sm:text-5xl">Error</p>
      <div class="sm:ml-6">
        <div class="sm:border-l sm:border-gray-300 sm:pl-6">
          <h1
            class="text-4xl font-extrabold text-gray-700 tracking-tight
            sm:text-5xl">
            Sorry, an error occurred.
          </h1>
          {#if reloadFunc}
            <p class="mt-1 text-base text-gray-500">
              The page you requested exists, but the relevant data could not be
              loaded. Click the button below to try again.
            </p>
          {:else}
            <p class="mt-1 text-base text-gray-500">
              The page you requested exists, but the relevant data could not be
              loaded. Please refresh the page to try again.
            </p>
          {/if}
        </div>
        <div
          class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
          {#if reloadFunc}
            <Button type="danger" on:click={reloadFunc}>Try again</Button>
            <Button type="danger-secondary" href={$url('/')}>Go back home</Button>
          {:else}
            <Button href={$url('/')}>Go back home</Button>
          {/if}
          <Button type="danger-secondary" href={$url('/support')}>
            Contact support
          </Button>
        </div>
      </div>
    </main>
    <div class="mt-10 text-base text-gray-500 space-y-6">
      <div>
        <slot />
      </div>
      {#if errorMessages}
        <Alert type="danger" messages={errorMessages} pre={true} />
      {/if}
    </div>
  </div>
</div>
