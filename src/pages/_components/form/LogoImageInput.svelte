<script>
  import { tick } from "svelte";
  import Button from "$components/common/Button.svelte";

  export let value = null;
  export let label = null;
  export let labelIsSROnly = false;
  export let maxUploadSize = null;
  export let valid = true;
  export let errorMessage = false;
  export let touched = false;
  export let disabled = false;
  export let required = false;
  export let containerClass = null;
  export let helperText = null;
  export let errorUseVisibility = false;
  export let initialImageBlob = null;
  export let changed = false;

  // Generate random string for name
  let name = Math.random()
    .toString(36)
    .slice(2);

  let logoUploadElem;
  let logoImageElem;
  let logoImageFormElem;
  let logoImageSelected = false;

  let forceDisabled = false;

  if (initialImageBlob) {
    logoImageSelected = true;
    revertImage();
  }

  async function showLogoPreview(event) {
    let logoElem = event.target;
    if (logoElem.files && logoElem.files[0]) {
      forceDisabled = true;
      logoImageSelected = true;

      await tick();

      logoImageElem.onload = () => {
        URL.revokeObjectURL(logoImageElem.src); // no longer needed, free memory
        forceDisabled = false;
        logoImageElem.onload = null;
      };

      logoImageElem.src = URL.createObjectURL(logoElem.files[0]); // set src to blob url
      value = logoElem.files[0];
      changed = true;
    }
  }

  function clearFileInput() {
    logoImageFormElem.reset();
    logoImageSelected = false;
    value = null;
    changed = true;
  }

  async function revertImage() {
    if (initialImageBlob) {
      forceDisabled = true;
      logoImageSelected = true;

      if (logoImageFormElem) {
        logoImageFormElem.reset();
      }

      await tick();

      logoImageElem.onload = logoImageCleanup;
      logoImageElem.onerror = logoImageCleanup;

      logoImageElem.src = URL.createObjectURL(initialImageBlob); // set src to blob url
      value = initialImageBlob;
      changed = false;
    }
  }

  function logoImageCleanup() {
    URL.revokeObjectURL(initialImageBlob); // no longer needed, free memory
    forceDisabled = false;

    if (logoImageElem) {
      logoImageElem.onload = null;
      logoImageElem.onerror = null;
    }
  }
</script>

<div class={containerClass}>
  <div class="sm:col-span-6">
    {#if label}
      {#if labelIsSROnly}
        <label for={name} class="sr-only">{label}</label>
      {:else}
        <!-- see "Before and after": https://tailwindcss.com/docs/hover-focus-and-other-states?email=george%40krugerindustrial.ac&password=Bosco -->
        <label for={name} class="block">
          <span
            class="{required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
            block text-sm font-medium text-gray-700">
            {label}
            {#if maxUploadSize}
              <span class="text-gray-400">
                (max upload size: {maxUploadSize})
              </span>
            {/if}
          </span>
        </label>
      {/if}
    {/if}
    <div class="mt-1 flex items-center">
      <span class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
        {#if logoImageSelected}
          <img alt="" class="h-full w-full object-fill" bind:this={logoImageElem} />
        {:else}
          <span class="h-full w-full inline-flex bg-sky-100">
            <div class="grid content-center w-full justify-center">
              <slot />
            </div>
          </span>
        {/if}
      </span>
      <Button
        on:click={() => {
          logoUploadElem.click();
        }}
        type="simple"
        disabled={disabled || forceDisabled}
        className="ml-5">
        Upload
        <form bind:this={logoImageFormElem}>
          <input
            bind:this={logoUploadElem}
            {name}
            disabled={disabled || forceDisabled}
            type="file"
            accept="image/png, image/jpeg"
            class="sr-only"
            on:change={showLogoPreview} />
        </form>
      </Button>
      <Button
        type="simple"
        className="ml-2"
        disabled={disabled || forceDisabled}
        on:click={clearFileInput}>
        Clear
      </Button>
      {#if initialImageBlob && changed}
        <Button
          type="simple"
          className="ml-2"
          disabled={disabled || forceDisabled}
          on:click={revertImage}>
          Revert
        </Button>
      {/if}
    </div>
  </div>
  {#if errorUseVisibility}
    <p
      class="text-sm text-rose-500 font-medium {helperText ? "-mb-3" : ""}"
      class:invisible={!(errorMessage && !valid && touched)}>
      {errorMessage}
    </p>
  {:else if errorMessage && !valid && touched}
    <p class="text-sm text-rose-500 font-medium {helperText ? "-mb-3" : ""}">{errorMessage}</p>
  {/if}
  {#if helperText}
    <p class="mt-2 text-sm text-gray-500 leading-4">{helperText}</p>
  {/if}
</div>
