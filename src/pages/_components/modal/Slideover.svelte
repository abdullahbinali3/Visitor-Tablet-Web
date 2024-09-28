<script>
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { isDescendant } from "$helpers/elements.js";
  import OutlineXIcon from "$icons/OutlineXIcon.svelte";
  import Button from "$components/common/Button.svelte";

  export let headerText = "";
  export let growFooter = true;
  export let headerType = "primary";
  export let showFooter = true;
  export let cancelText = "Cancel";
  export let acceptText = "Save";
  export let formDisabled = false;

  const dispatch = createEventDispatcher();
  let modalElem = null;
  let closeButtonElem = null;
  let cancelButtonElem = null;

  function closeModal(e) {
    if (formDisabled) {
      return;
    }

    if (
      e &&
      (e.type === "mousedown" || e.type === "touchstart") &&
      (e.target === modalElem || isDescendant(modalElem, e.target))
    ) {
      return;
    }

    if (
      e &&
      (e.target === modalElem || isDescendant(modalElem, e.target)) &&
      (e.target !== closeButtonElem && !isDescendant(closeButtonElem, e.target))
    ) {
      return;
    }

    dispatch("cancel");
  }

  function acceptModal() {
    if (formDisabled) {
      return;
    }

    dispatch("accept");
  }

  $: headerBgClasses = getHeaderBgClasses(headerType);
  $: headerTextClasses = getHeaderTextClasses(headerType);
  $: headerSubTextClasses = getHeaderSubTextClasses(headerType);
  $: headerCloseIconClasses = getHeaderCloseIconClasses(headerType);

  function getHeaderBgClasses() {
    if (!headerType) {
      return "bg-white";
    }
    switch (headerType) {
      case "primary":
        return "bg-sky-700";
      case "secondary":
        return "bg-gray-50";
      default:
        return "bg-white";
    }
  }

  function getHeaderTextClasses() {
    if (!headerType) {
      return "text-gray-900";
    }
    switch (headerType) {
      case "primary":
        return "text-white";
      case "secondary":
        return "text-gray-900";
      default:
        return "text-gray-900";
    }
  }

  function getHeaderSubTextClasses() {
    if (!headerType) {
      return "text-gray-500";
    }
    switch (headerType) {
      case "primary":
        return "text-sky-300";
      case "secondary":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  }

  function getHeaderCloseIconClasses() {
    if (!headerType) {
      return "text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-sky-500";
    }
    switch (headerType) {
      case "primary":
        return "text-sky-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white";
      case "secondary":
        return "text-gray-400 hover:text-gray-500";
      default:
        return "text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-sky-500";
    }
  }
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div
  class="relative z-10"
  aria-labelledby="slide-over-title"
  role="dialog"
  aria-modal="true">
  <!--
    Background backdrop, show/hide based on slide-over state.

    Entering: "ease-in-out duration-500"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in-out duration-500"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    aria-hidden="true"
    transition:fade={{ duration: 500 }}
    on:click={closeModal} />

  <div class="fixed inset-0 overflow-hidden">
    <div
      class="absolute inset-0 overflow-hidden"
      on:mousedown={closeModal}
      on:touchstart|passive={closeModal}>
      <div
        class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <!--
          Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
        <div
          transition:fly={{ x: 448, duration: 500 }}
          class="pointer-events-auto w-screen max-w-md"
          bind:this={modalElem}>
          <form
            class="flex h-full flex-col divide-y divide-gray-200 bg-white
            shadow-xl">
            <!-- <div class="h-0 flex-1 overflow-y-auto" style="max-height: 47.8rem;"> -->
            <div class="{growFooter ? '' : 'h-0 flex-1'} overflow-y-auto">
              <div class="{headerBgClasses} py-6 px-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <h2
                    class="text-lg font-medium {headerTextClasses}"
                    id="slide-over-title">
                    {headerText}
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    {#if !formDisabled}
                      <button
                        on:click={closeModal}
                        bind:this={closeButtonElem}
                        type="button"
                        class="rounded-md {headerBgClasses}
                        {headerCloseIconClasses}">
                        <span class="sr-only">Close panel</span>
                        <OutlineXIcon />
                      </button>
                    {/if}
                  </div>
                </div>
                {#if $$slots.subHeading}
                  <div class="mt-1">
                    <p class="text-sm {headerSubTextClasses}">
                      <slot name="subHeading" />
                    </p>
                  </div>
                {/if}
              </div>
              <div class="flex flex-1 flex-col justify-between">
                <slot />
              </div>
            </div>
            {#if showFooter}
              <slot name="footer">
                <div class:grow={growFooter}>
                  <div class="flex flex-shrink-0 justify-end px-4 py-4">
                    <Button
                      type="simple"
                      disabled={formDisabled}
                      bind:this={cancelButtonElem}
                      on:click={() => closeModal(null)}>
                      {cancelText}
                    </Button>
                    <Button
                      className="ml-4 inline-flex justify-center"
                      disabled={formDisabled}
                      on:click={acceptModal}>
                      {acceptText}
                    </Button>
                  </div>
                </div>
              </slot>
            {/if}
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
