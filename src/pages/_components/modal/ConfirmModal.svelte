<script>
  import { createEventDispatcher } from "svelte";
  import { scale, fade } from "svelte/transition";
  import { t } from "svelte-i18n";

  //import Modal from "$components/modal/Modal.svelte";
  import OutlineCheckIcon from "$icons/OutlineCheckIcon.svelte";
  import OutlineExclamationIcon from "$icons/OutlineExclamationIcon.svelte";
  import OutlineXIcon from "$icons/OutlineXIcon.svelte";

  export let type;
  export let title = null;
  export let hideCloseButton = false;
  export let acceptText = "OK";
  export let cancelText = "Cancel";

  let formDisabled = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    if (formDisabled) {
      return;
    }

    dispatch("cancel");
  }

  function acceptModal() {
    if (formDisabled) {
      return;
    }

    formDisabled = true;
    dispatch("accept");
  }
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20
    text-center sm:block sm:p-0"
  >
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
      on:click={closeModal}
    />

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" on:click={closeModal}> &#8203; </span>

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
      class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5
      pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8
      sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
    >
      {#if !hideCloseButton}
        <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            on:click={closeModal}
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-sky-500"
          >
            <span class="sr-only">{$t("main.close")}</span>
            <OutlineXIcon />
          </button>
        </div>
      {/if}
      <div class="sm:flex sm:items-start">
        {#if type === "success"}
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12
            w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <OutlineCheckIcon classColor="text-green-600" />
          </div>
        {:else if type === "error" || type === "danger"}
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12
            w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <OutlineExclamationIcon classColor="text-red-600" />
          </div>
        {:else if type === "warning"}
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12
            w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <OutlineExclamationIcon classColor="text-yellow-600" />
          </div>
        {/if}
        <div
          class="mt-3 text-center sm:mt-0 {type === 'success' || type === 'error' || type === 'danger' || type === 'warning' ? 'sm:ml-4' : ''}
          sm:text-left"
        >
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {title}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              <slot />
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        {#if type === "success"}
          <button
            on:click={acceptModal}
            type="button"
            class="w-full inline-flex justify-center rounded-md border
            border-transparent shadow-sm px-4 py-2 bg-green-600 text-base
            font-medium text-white hover:bg-green-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3
            sm:w-auto sm:text-sm"
          >
            {acceptText}
          </button>
        {:else if type === "error" || type === "danger"}
          <button
            on:click={acceptModal}
            type="button"
            class="w-full inline-flex justify-center rounded-md border
            border-transparent shadow-sm px-4 py-2 bg-red-600 text-base
            font-medium text-white hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3
            sm:w-auto sm:text-sm"
          >
            {acceptText}
          </button>
        {:else if type === "warning"}
          <button
            on:click={acceptModal}
            type="button"
            class="w-full inline-flex justify-center rounded-md border
            border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base
            font-medium text-white hover:bg-yellow-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3
            sm:w-auto sm:text-sm"
          >
            {acceptText}
          </button>
        {:else}
          <button
            on:click={acceptModal}
            type="button"
            class="w-full inline-flex justify-center rounded-md border
            border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base
            font-medium text-white hover:bg-sky-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:ml-3
            sm:w-auto sm:text-sm"
          >
            {acceptText}
          </button>
        {/if}
        <button
          on:click={closeModal}
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border
          border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium
          text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-sky-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          {cancelText}
        </button>
      </div>
    </div>
  </div>
</div>
