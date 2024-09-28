<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { scale, fade } from "svelte/transition";
  import { t } from "svelte-i18n";

  import Button from "$components/common/Button.svelte";
  
  export let hideFooter = false;
  export let hideCloseButton = false;
  export let containerClass = "";
  export let maxWidthClass = "sm:max-w-sm";
  export let disabled = false;

  let contentElem;

  const dispatch = createEventDispatcher();

  function closeModal() {
    if (disabled) {
      return;
    }
    
    dispatch("cancel");
  }

  onMount(function() {
    // Focus the first non-hidden field input element when the modal opens
    let firstInput = contentElem.querySelector('input:not([type="hidden"])');

    if (firstInput) {
      firstInput.focus();
    }
  });
</script>

<div
  class="fixed z-20 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true">
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20
    text-center sm:block sm:p-0">
    <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      aria-hidden="true"
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 200 }}
      on:click={closeModal} />

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span
      class="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true"
      on:click={closeModal}>
      &#8203;
    </span>

    <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
    <div
      in:scale={{ start: 0.95, duration: 300 }}
      out:scale={{ start: 0.95, duration: 200 }}
      class="inline-block align-bottom bg-white px-4 pt-5 pb-4
      text-left overflow-hidden shadow-xl transform transition-all sm:my-8
      sm:align-middle sm:w-full sm:p-6 {containerClass} {maxWidthClass}">
      {#if !hideCloseButton}
        <!-- todo -->
      {/if}
      <div bind:this={contentElem}>
        <slot />
      </div>
      {#if !hideFooter}
        <div class="mt-5 sm:mt-6">
          <slot name="footer">
            <Button on:click={closeModal} focused={true} block={true}>
              {$t("main.close")}
            </Button>
          </slot>
        </div>
      {/if}
    </div>
  </div>
</div>
