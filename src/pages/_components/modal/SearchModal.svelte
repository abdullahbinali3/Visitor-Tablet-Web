<script>
  import { scale, fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { isDescendant } from "$helpers/elements.js";
  import SolidSearchIcon from "$icons/SolidSearchIcon.svelte";

  const dispatch = createEventDispatcher();

  export let placeholder = "Search...";
  export let noResultsText = "No items to display.";
  export let valueVariable = "value";
  export let textVariable = "text";
  export let items = []; // should be array of object { value: 123, text: "abc" }

  let elem;

  function closeModal(e) {
    if (e && (e.type === "mousedown" || e.type === "touchstart") && (e.target === elem || isDescendant(elem, e.target))) {
      return;
    }

    if (e && e.target !== elem && !isDescendant(elem, e.target)) {
      dispatch("cancel");
    }
  }

  function handleSearchInput(e) {
    console.log("handleSearchInput", e.target.value);
  }

  function handleItemSelected(value) {
    console.log("itemselected", value);
    dispatch("itemselected", value);
  }
</script>

<div class="relative z-50" role="dialog" aria-modal="true" on:mousedown={closeModal} on:touchstart|passive={closeModal}>
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div
    class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
    on:click={closeModal}
  />

  <div class="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
    <!--
      Command palette, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 scale-95"
        To: "opacity-100 scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
    -->
    <div
      bind:this={elem}
      in:scale={{ start: 0.95, duration: 300 }}
      out:scale={{ start: 0.95, duration: 200 }}
      class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden
      rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5
      transition-all"
    >
      <div class="relative">
        <SolidSearchIcon
          className="pointer-events-none absolute top-3.5 left-4 h-5 w-5
          text-gray-400"
        />
        <input
          on:input={handleSearchInput}
          type="text"
          class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800
          placeholder-gray-400 focus:ring-0 sm:text-sm"
          {placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls="options"
        />
      </div>

      <!-- Results, show/hide based on command palette state -->
      {#if items && items.length > 0}
        <ul class="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800" id="options" role="listbox">
          <!-- Active: "bg-indigo-600 text-white" -->
          {#each items as item (item[valueVariable])}
            <li
              on:click={() => {
                handleItemSelected(item[valueVariable]);
              }}
              class="cursor-pointer select-none px-4 py-2 hover:bg-sky-600
              hover:text-white"
              role="option"
              tabindex="-1"
            >
              {item[textVariable]}
            </li>
          {/each}
        </ul>
      {:else}
        <!-- Empty state, show/hide based on command palette state -->
        <p class="p-4 text-sm text-gray-500">{noResultsText}</p>
      {/if}
    </div>
  </div>
</div>
